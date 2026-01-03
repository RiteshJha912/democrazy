import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { CubeTransparentIcon, WalletIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import './styles/AppShell.css';

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // ... connect wallet logic same as before ...
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            });
          } catch (switchError) {
             // Handle switch error (same as before)
             alert("Please switch to Sepolia testnet.");
             setIsConnecting(false);
             return;
          }
        }
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const account = await signer.getAddress();
        setSigner(signer);
        setAccount(account);
      } catch (error) {
        console.error("Connection failed", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) disconnectWallet();
        else setAccount(accounts[0]);
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          account={account} 
          connectWallet={connectWallet} 
          disconnectWallet={disconnectWallet}
          isConnecting={isConnecting}
        />
        <main className="main-content" style={{flex: 1}}>
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/create" element={<CreatePoll signer={signer} account={account} />} />
            <Route path="/polls/:id" element={<PollDetail signer={signer} account={account} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ account, connectWallet, disconnectWallet, isConnecting }) {
  const location = useLocation();

  return (
    <nav className="navbar-glass">
      <Link to="/" className="nav-brand">
        <CubeTransparentIcon className="h-8 w-8 text-primary" style={{height: '32px', color: '#6366f1'}} />
        <span>Democrazy</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}>
          Polls
        </Link>
        <Link to="/create" className={`nav-link-item ${location.pathname === '/create' ? 'active' : ''}`}>
          Create Poll
        </Link>
      </div>

      <div className="nav-actions">
        {account ? (
          <button className="btn-connect-wallet btn-connected" onClick={disconnectWallet}>
            <CheckCircleIcon className="h-5 w-5" style={{height: '20px'}} />
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          </button>
        ) : (
          <button className="btn-connect-wallet" onClick={connectWallet} disabled={isConnecting}>
            <WalletIcon className="h-5 w-5" style={{height: '20px'}} />
            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer-minimal">
      <p>&copy; 2024 Democrazy. Decentralized Voting on Sepolia.</p>
      <div style={{marginTop: '0.5rem'}}>
        <a href="#" className="footer-link">Documentation</a>
        <a href="#" className="footer-link">Contract</a>
        <a href="#" className="footer-link">Support</a>
      </div>
    </footer>
  );
}

export default App;
