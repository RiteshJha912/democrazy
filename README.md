# Democrazy

Democrazy is a decentralized voting application (dApp) deployed on the Ethereum Sepolia Testnet. It leverages a hybrid architecture, combining the security of an on-chain smart contract with the efficiency of an off-chain MongoDB database for indexing and fast data retrieval.

## Technologies

*   **Smart Contract**: Solidity, Hardhat
*   **Backend**: Node.js, Express, MongoDB
*   **Frontend**: React.js, Ethers.js, Bootstrap

## Prerequisites

Ensure you have the following installed before proceeding:
1.  Node.js (v16 or higher)
2.  MongoDB (Local instance or Atlas URI)
3.  MetaMask (Browser extension)
4.  Git

## Setup Guide

Follow these steps strictly in order to ensure all components are linked correctly.

### 1. Smart Contract Deployment
This is the most critical step. You must deploy the contract first to obtain the address for the backend and frontend.

1.  Navigate to the contract directory:
    ```bash
    cd smart-contract
    npm install
    ```

2.  Create a `.env` file in the `smart-contract` folder. You will need an API key from a provider like Alchemy or Infura and your wallet's private key.
    ```env
    SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
    PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY_WITHOUT_0x
    ```
    **Note**: Ensure your wallet has Sepolia ETH. You can get this from a Sepolia Faucet.

3.  Compile and deploy the contract to the Sepolia network:
    ```bash
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network sepolia
    ```

4.  **Important**: The console will output a Contract Address (e.g., `0x123...`). Copy this address; you will need it for the next steps.

### 2. Backend Configuration
The backend requires the contract address to listen for events like `PollCreated` and `VoteCasted`.

1.  Navigate to the backend directory:
    ```bash
    cd ../backend
    npm install
    ```

2.  Create a `.env` file in the `backend` folder:
    ```env
    MONGO_URI=mongodb://localhost:27017/democrazy
    SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
    CONTRACT_ADDRESS=PASTE_YOUR_CONTRACT_ADDRESS_HERE
    PORT=5000
    ```
    *   Use the same `SEPOLIA_URL` as the smart contract setup.
    *   Paste the address from Step 1 into `CONTRACT_ADDRESS`.

3.  Start the server:
    ```bash
    npm start
    ```
    Ensure you see the message "MongoDB connected" and that the server is listening.

### 3. Frontend Configuration
The frontend connects to the smart contract using Ethers.js.

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    npm install
    ```

2.  Create a `.env` file in the `frontend` folder:
    ```env
    REACT_APP_CONTRACT_ADDRESS=PASTE_YOUR_CONTRACT_ADDRESS_HERE
    ```

3.  Start the application:
    ```bash
    npm start
    ```
    The app will launch at `http://localhost:3000`.

## Architecture Overview

**On-Chain (Solidity)**:
*   Stores the canonical state of votes.
*   Emits events (`PollCreated`, `VoteCasted`) whenever a state change occurs.

**Off-Chain (MongoDB)**:
*   The backend listens to these events in real-time.
*   It creates a read-optimized replica of the data in MongoDB.
*   This allows the frontend to fetch the list of polls instantly without querying the blockchain for every single item, which would be slow and inefficient.

## Troubleshooting

*   **Transaction Fails**: Ensure you are on the Sepolia network and have sufficient test ETH.
*   **Poll Not Showing**: If you created a poll but it doesn't appear on the home screen, check the backend terminal. If the backend is not running or the `SEPOLIA_URL` is invalid, it cannot miss the blockchain event.
