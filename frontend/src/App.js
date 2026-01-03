import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Force network switch to Sepolia (Chain ID: 11155111 / 0xaa36a7)
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
               alert("Sepolia network is not added to your MetaMask. Please add it manually or enable 'Show test networks' in MetaMask settings.");
            } else {
               console.error("Failed to switch network:", switchError);
               alert("Please switch your MetaMask network to Sepolia manually.");
               return;
            }
          }
        }

        // Re-initialize provider/signer after potential network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const account = await signer.getAddress();
        setSigner(signer);
        setAccount(account);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 rounded px-3">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Voting dApp</Link>
            <div className="d-flex align-items-center">
              <Link to="/" className="btn btn-outline-light me-2">Home</Link>
              <Link to="/create" className="btn btn-success me-3">Create Poll</Link>
               {account ? (
                 <span className="navbar-text text-white border border-secondary px-3 py-1 rounded">
                   {account.slice(0,6)}...{account.slice(-4)}
                 </span>
               ) : (
                 <button className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
               )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/create" element={<CreatePoll signer={signer} />} />
          <Route path="/polls/:id" element={<PollDetail signer={signer} account={account} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
