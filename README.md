# Decentralized Voting Application (dApp)

A full-stack decentralized application for creating polls and voting, built on the Ethereum Sepolia Testnet. This project utilizes a **MERN stack** (MongoDB, Express, React, Node.js) combined with **Web3** technologies (Solidity, Hardhat, Ethers.js).

## 🚀 Key Features

*   **Create Polls**: Users can create new polls with a question and 2-5 options. Transactions are secured on the blockchain.
*   **Vote Securely**: One vote per wallet address per poll. Duplicate voting is prevented by the smart contract.
*   **Real-time Results**: Live vote counts are displayed using Chart.js, fetching data directly from the blockchain.
*   **Hybrid Architecture**: 
    *   **On-chain**: Secure execution of voting logic and immutable record of votes (Smart Contract).
    *   **Off-chain**: Efficient storage of poll metadata and indexing for fast retrieval (MongoDB).
    *   **Event Listening**: The backend listens to blockchain events to keep the off-chain database in sync.

## 🛠️ Tech Stack

### Smart Contract & Blockchain
*   **Language**: Solidity (v0.8.20)
*   **Framework**: Hardhat (Development, Testing, Deployment)
*   **Network**: Ethereum Sepolia Testnet
*   **Interaction**: Ethers.js (v6)

### Backend (API & Indexer)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Role**: Serves poll list API and indexes events (`PollCreated`, `VoteCasted`) from the blockchain.

### Frontend (Client)
*   **Library**: React.js (Create React App)
*   **Styling**: Bootstrap 5
*   **Visualization**: Chart.js / react-chartjs-2
*   **Wallet Connection**: MetaMask (via window.ethereum)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16+)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud URI)
*   [MetaMask](https://metamask.io/) browser extension
*   Git

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository_url>
cd voting-dapp
```

### 2. Smart Contract Setup
Navigate to the contract directory to compile and deploy the voting logic.

```bash
cd smart-contract
npm install
```

**Configuration:**
Create a `.env` file in `smart-contract/` based on `.env.example`:
```env
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

**Deploy:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
*Note down the deployed **Contract Address** from the output.*

### 3. Backend Setup
The backend listens for blockchain events to populate the database.

```bash
cd ../backend
npm install
```

**Configuration:**
Create a `.env` file in `backend/` based on `.env.example`:
```env
MONGO_URI=mongodb://localhost:27017/voting-dapp
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
PORT=5000
```
*Ensure `CONTRACT_ADDRESS` matches the one from the previous step.*

**Start Server:**
```bash
npm start
```

### 4. Frontend Setup
The user interface for voting.

```bash
cd ../frontend
npm install
```

**Configuration:**
Create a `.env` file in `frontend/` based on `.env.example`:
```env
REACT_APP_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

**Start Application:**
```bash
npm start
```
The app should now be running at [http://localhost:3000](http://localhost:3000).

---

## 📖 Usage Guide

1.  **Connect Wallet**: Click "Connect Wallet" on the top right. Accept the prompt to switch to **Sepolia** network if asked.
2.  **Create Poll**: 
    *   Navigate to "Create Poll".
    *   Enter a question and adds options.
    *   Click "Create". Confirm the transaction in MetaMask.
    *   *Wait approx 15-30s* for the block to verify and the backend to index the event.
3.  **Vote**:
    *   Go to Home to see the list of polls.
    *   Click "Vote Now" on a poll.
    *   Select an option. Confirm the transaction.
    *   Watch the chart update in real-time once the transaction confirms.

## 🤝 Contribution
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
