# Deployment Guide for Democrazy

This project consists of three parts that need to be handled separately:
1.  **Smart Contract** (Ethereum/Sepolia)
2.  **Backend** (Node.js API & Database)
3.  **Frontend** (React Static Site)

---

## 1. Smart Contract (Already Deployed?)
If you have already deployed to Sepolia during development, you just need your **Contract Address**.
If not, deploy it now:

1.  Navigate to `smart-contract` folder.
2.  Run: `npx hardhat run scripts/deploy.js --network sepolia`
3.  **Save the address**. You will need it for the frontend.

---

## 2. Database (MongoDB Atlas)
Since you need a live database for the backend:
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Create a new user (Network Access -> Allow All IP `0.0.0.0/0` for simplicity, or whitelist your backend IP later).
4.  Get the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`

---

## 3. Backend Deployment (Render.com)
Render is reliable for Node.js apps.

1.  Push your code to **GitHub**.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  **Root Directory**: `backend`
6.  **Build Command**: `npm install`
7.  **Start Command**: `npm start`
8.  **Environment Variables**:
    *   `MONGO_URI`: (Your MongoDB Atlas connection string from step 2)
    *   `PORT`: `5000` (or let Render assign one)
9.  Deploy. **Copy the backend URL** (e.g., `https://democrazy-api.onrender.com`).

---

## 4. Frontend Deployment (Vercel)
Vercel is optimized for React.

1.  Go to [Vercel](https://vercel.com/).
2.  **Add New Project** -> Import from GitHub.
3.  Select your repo.
4.  **Framework Preset**: Create React App.
5.  **Root Directory**: Edit this -> select `frontend`.
6.  **Environment Variables**:
    *   `REACT_APP_CONTRACT_ADDRESS`: `0xYourSmartContractAddress...`
    *   `REACT_APP_API_URL`: (Your Render Backend URL from step 3)
7.  Deploy.

---

## 5. Verification
1.  Open your Vercel URL.
2.  Connect Wallet.
3.  Try creating a poll.
4.  **Important**: Ensure your Backend (Render) allows requests from your Frontend (Vercel). You might need to update CORS in `backend/server.js` if you have restrictive settings:
    ```javascript
    app.use(cors({ origin: 'https://your-vercel-app.vercel.app' }));
    ```


