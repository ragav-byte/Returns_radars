# ReturnsRadar

ReturnsRadar is a React + Firebase + Node.js app for reviewing product return requests with AI-assisted decision support. Customers can submit a return with an order ID, product ID, reason, and product image. Admins can review the queue, manage users, and update final decisions.

## What is in this repo

- `frontend/`: React app for customer and admin experiences
- `backend/`: Express API that handles image upload and Gemini review
- `python_models/`: small utility scripts and image assets used during earlier experiments

## Main features

- Email/password authentication with Firebase Auth
- Role-based dashboards for customers and admins
- Customer return submission flow with product lookup from local `order.json`
- AI-assisted review via Gemini
- Firestore-backed request history
- Admin return queue and user management

## Prerequisites

- Node.js 18+ recommended
- npm
- A Firebase project with Authentication and Firestore enabled
- A Gemini API key

## Environment setup

Create `backend/.env` with at least:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
```

The frontend Firebase configuration currently lives in:

- `frontend/src/firebase/config.js`

If you move to environment-based frontend config later, update that file accordingly.

## Install dependencies

From the repo root:

```bash
npm install
```

Then install frontend dependencies:

```bash
cd frontend
npm install
```

## Run the app

Start the backend:

```bash
cd backend
node server.js
```

Start the frontend in a second terminal:

```bash
cd frontend
npm start
```

The frontend runs at [http://localhost:3000](http://localhost:3000) by default.  
The backend runs at [http://localhost:5000](http://localhost:5000) by default.

## Useful scripts

Frontend:

```bash
cd frontend
npm start
npm run build
npm test
```

Root dependencies:

```bash
npm install
```

## Notes

- Customer and admin roles are stored in the Firestore `users` collection.
- Return history is stored in the Firestore `popupHistory` collection.
- The local product/order data used for lookup is in `frontend/public/order.json` and `backend/order.json`.

## Recent improvements

- Fixed the primary auth flow so login, signup, and sign-out behave consistently through Firebase session state.
- Improved the customer dashboard and admin UI for better layout, readability, and status handling.
- Added clearer fallback behavior for manual-review responses from the backend.
