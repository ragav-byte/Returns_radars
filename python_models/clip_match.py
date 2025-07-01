import clip
import torch
import sys
from PIL import Image
product_name = sys.argv[1]
image_path = sys.argv[2]
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)
image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
text = clip.tokenize([product_name]).to(device)
with torch.no_grad():
    image_features = model.encode_image(image)
    text_features = model.encode_text(text)
    similarity = (image_features @ text_features.T).softmax(dim=-1)
print(f"{similarity[0][0].item()*100:.2f}")
