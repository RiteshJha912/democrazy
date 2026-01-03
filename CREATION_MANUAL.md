# The Democrazy Blueprint: A Zero-to-Hero Creation Manual

This manual documents the exact architectural steps and terminal commands required to rebuild the **Democrazy** ecosystem from scratch. It connects the Blockchain, Backend, and Frontend layers.

---

## **Phase 1: The Foundation (Smart Contract)**
*Goal: Deploy the immutable voting logic to the Ethereum Sepolia Testnet.*

1.  **Initialize Project Root**
    ```bash
    mkdir democrazy
    cd democrazy
    ```

2.  **Setup Hardhat Environment**
    ```bash
    mkdir smart-contract
    cd smart-contract
    npm init -y
    npm install --save-dev hardhat
    npx hardhat init 
    # Select "Create a JavaScript project" or "Empty hardhat.config.js"
    ```

3.  **Install Dependencies**
    ```bash
    npm install --save-dev @nomicfoundation/hardhat-toolbox dotenv
    ```

4.  **Configuration**
    *   Create a `.env` file containing `SEPOLIA_RPC_URL` (from Alchemy/Infura) and `PRIVATE_KEY` (from MetaMask).
    *   Update `hardhat.config.js` to add the Sepolia network configuration.

5.  **Develop & Compile**
    *   Create `contracts/Voting.sol`.
    *   Compile the solidity code:
    ```bash
    npx hardhat compile
    ```

6.  **Deploy**
    *   Create `scripts/deploy.js`.
    *   Run the deployment script:
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```
    *   **CRITICAL**: Copy the deployed **Contract Address** output. You will need this later.

---

## **Phase 2: The Logic Layer (Backend)**
*Goal: Create an event indexer and API to speed up data fetching.*

1.  **Initialize Backend**
    ```bash
    cd ..
    mkdir backend
    cd backend
    npm init -y
    ```

2.  **Install Core Libraries**
    ```bash
    npm install express mongoose cors ethers dotenv nodemon
    ```

3.  **Database Setup (MongoDB Atlas)**
    *   Go to mongodb.com, create a free Cluster.
    *   Create a Database User.
    *   Allow specific IP addresses or `0.0.0.0/0`.
    *   Copy the **Connection String**.

4.  **Configuration**
    *   Create `.env` file with:
        *   `MONGO_URI` (Your connection string)
        *   `SEPOLIA_URL` (Same as Phase 1)
        *   `CONTRACT_ADDRESS` (From Phase 1)
        *   `PORT=5000`

5.  **Architecture**
    *   Create `server.js` (Entry point).
    *   Create `models/Poll.js` (Mongoose Schema).
    *   Create `routes/polls.js` (API endpoints).
    *   **Event Listener**: Start the listener in `server.js` to index `PollCreated` and `VoteCasted` events from the blockchain.

6.  **Run Locally**
    ```bash
    npm start
    ```

---

## **Phase 3: The Experience (Frontend)**
*Goal: Build a stunning, interactive Web3 interface.*

1.  **Initialize React App**
    ```bash
    cd ..
    npx create-react-app frontend
    cd frontend
    ```

2.  **Install Web3 & UI Libraries**
    ```bash
    npm install ethers react-router-dom @heroicons/react react-chartjs-2 chart.js react-icons
    ```

3.  **Clean & Structure**
    *   Remove default boilerplate files.
    *   Create structure: `src/components`, `src/styles`, `src/utils`.

4.  **Configuration**
    *   Create `.env` file:
        *   `REACT_APP_CONTRACT_ADDRESS` (From Phase 1)
        *   `REACT_APP_API_URL` (http://localhost:5000 for dev)

5.  **Development**
    *   **Styling**: Setup `index.css` with global variables (CSS Variables for glassmorphism).
    *   **Components**: Build `Navbar`, `PollList`, `PollDetail`, `CreatePoll`.
    *   **Web3 Logic**: Implement wallet connection in `App.js` using `ethers.BrowserProvider`.

6.  **Run Locally**
    ```bash
    npm start
    ```

---

## **Phase 4: Going Live (Deployment)**

### **1. Backend (Render.com)**
1.  Push code to GitHub.
2.  New Web Service -> Connect Repo.
3.  Root Directory: `backend`.
4.  Build: `npm install`. Start: `npm start`.
5.  Add Environment Variables (`MONGO_URI`, etc).

### **2. Frontend (Vercel)**
1.  Import Repo to Vercel.
2.  Root Directory: `frontend`.
3.  Add Environment Variables:
    *   `REACT_APP_API_URL`: (Your new Render URL)
    *   `REACT_APP_CONTRACT_ADDRESS`: (Your Contract Address)
4.  Deploy.

---

## **Running the Full Stack Locally**
To work on the project, you will need two active terminals:

**Terminal 1 (Backend)**:
```bash
cd backend
npm start
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm start
```
