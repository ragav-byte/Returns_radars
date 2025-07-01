require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const sharp = require('sharp');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = 5000;

// Load local JSON helper
function loadJSON(filePath) {
    const fullPath = path.join(__dirname, filePath);
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

// Middleware setup
app.use(cors());

app.use(express.json());

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Convert uploaded image to base64
async function convertImageToBase64(buffer) {
    const image = await sharp(buffer).resize({ width: 512 }).toBuffer();
    return image.toString('base64');
}

// Trust score calculation
function computeCustomerTrustScore(history) {
    let score = 100;
    if (history.totalReturns > 5) score -= 30;
    if (history.flaggedReturns > 2) score -= 40;
    if (history.firstTimeReturn) score += 10;
    return Math.max(0, Math.min(score, 100));
}

function computeProductTrustScore(productHistory) {
    let score = 100;
    if (productHistory.totalReturns > 10) score -= 25;
    if (productHistory.defectiveReports > 3) score -= 30;
    return Math.max(0, Math.min(score, 100));
}

// Gemini AI call
async function queryGeminiAI({ imageBase64, returnReason, productSpecs, customerHistory, productHistory }) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const filePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
        }
    };

    const textPrompt = `
You are a fraud detection expert working in the return processing unit of an e-commerce platform.

### Inputs:

- **Return Reason**: ${returnReason}
- **Product Specs (as per catalog)**: ${productSpecs}
- **Customer History**: ${JSON.stringify(customerHistory)}
- **Product History**: ${JSON.stringify(productHistory)}
- **Image of Returned Product**: (Attached)

### Tasks:

1. Analyze the product image.
2. Confirm if return reason is supported:
   - Color mismatch? Is image color different from "${productSpecs}"?
   - Damage? Is it visible?
3. Recommend: Accept or Manual Verification.

### Output:

#### Part 1: Admin Review
Explain what you observe, whether the reason is supported, and your final recommendation.

#### Part 2: JSON Summary
\`\`\`json
{
  "reasonMatched": true,
  "damageConfirmation": "<Yes / No>",
  "colorMismatch": "<Yes / No / Not Applicable>",
  "customerTrustScore": ${customerHistory.trustScore},
  "productTrustScore": ${productHistory.trustScore},
  "finalDecision": "<Accept / Manual Verification>",
  "customerMessage": "<message>"
}
\`\`\`
Only return the Admin Review and JSON Summary.
`;

    const result = await model.generateContent({
        contents: [{ parts: [filePart, { text: textPrompt }] }]
    });

    return result.response.candidates[0]?.content.parts[0]?.text || "No response";
}

// Main route
app.post('/generate-return-review', upload.single('productMedia'), async (req, res) => {
    try {
        const { orderId, productId, returnReason } = req.body;
        const productMedia = req.file;

        // Load data
        const orderDB = loadJSON('./order.json');
        const productDB = loadJSON('./product_history.json');
        const deliveryDB = loadJSON('./delivery_details.json');

        const order = orderDB[orderId];
        const product = productDB[productId];
        const delivery = deliveryDB[orderId];

        if (!order || !product || !delivery) {
            return res.status(404).json({ error: 'Order/Product/Delivery not found' });
        }

        const item = order.products.find(p => p.productId === productId);
        if (!item) {
            return res.status(404).json({ error: 'Product not part of the order' });
        }

        const customerTrustScore = computeCustomerTrustScore(order.customerHistory);
        const productTrustScore = computeProductTrustScore(product);

        const imageBase64 = await convertImageToBase64(productMedia.buffer);

        // Delivery analysis
        let deliveryComment = '';
        if (returnReason.toLowerCase().includes("item missing")) {
            deliveryComment = `Delivered by ${delivery.courier} on ${delivery.deliveredOn}, status: Delivered`;
        }

        // Weight mismatch
        let weightMismatchComment = '';
        if (returnReason.toLowerCase().includes("product not found")) {
            if (delivery.deliveryWeight && product.weight) {
                const dw = parseInt(delivery.deliveryWeight);
                const pw = parseInt(product.weight);
                const diff = Math.abs(dw - pw);
                if (diff > 20) {
                    weightMismatchComment = `Warning: Delivery weight (${delivery.deliveryWeight}) vs product weight (${product.weight}) differ significantly.`;
                }
            }
        }

        const geminiRaw = await queryGeminiAI({
            imageBase64,
            returnReason,
            productSpecs: item.specs,
            customerHistory: { ...order.customerHistory, trustScore: customerTrustScore },
            productHistory: { ...product, trustScore: productTrustScore }
        });

        // Extract structured parts from Gemini
        const [adminPart, jsonPart] = geminiRaw.split('```json');
        let structuredSummary = {};
        try {
            const jsonText = jsonPart?.replace(/```/g, '').trim();
            structuredSummary = JSON.parse(jsonText);
        } catch (err) {
            console.error("Error parsing JSON summary from Gemini:", err);
            structuredSummary = { error: 'Failed to parse Gemini summary.' };
        }

        // Parse Admin Review
        const lines = adminPart?.split('\n').map(line => line.trim()) || [];
        let adminObservation = '', recommendation = '', reasonInfo = '';
        for (let line of lines) {
            if (line.toLowerCase().includes('the image shows')) adminObservation = line;
            if (line.toLowerCase().includes('reason')) reasonInfo = line;
            if (line.toLowerCase().includes('recommendation')) recommendation = line;
        }

        // Final JSON Response
        res.json({
            adminObservation: adminObservation || "Not found",
            reasonClearlySupported: structuredSummary.reasonMatched ?? "Not specified",
            finalRecommendation: recommendation || "Not specified",
            reasonMatched: structuredSummary.reasonMatched,
            damageConfirmation: structuredSummary.damageConfirmation,
            colorMismatch: structuredSummary.colorMismatch,
            customerTrustScore: structuredSummary.customerTrustScore,
            productTrustScore: structuredSummary.productTrustScore,
            finalDecision: structuredSummary.finalDecision,
            customerMessage: structuredSummary.customerMessage,
            deliveryCheck: deliveryComment || "No delivery issues reported.",
            weightAnalysis: weightMismatchComment || "No major weight mismatch detected."
        });

    } catch (error) {
        console.error('Error processing return request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`ReturnsRadar running at http://localhost:${port}`);
});
