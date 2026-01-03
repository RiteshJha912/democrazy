import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { CubeTransparentIcon, WalletIcon, HeartIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import { FaGithub } from 'react-icons/fa';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import AboutPage from './components/AboutPage';
import ScrollToTop from './components/ScrollToTop';
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
      <ScrollToTop />
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
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ account, connectWallet, disconnectWallet, isConnecting }) {
  const location = useLocation();
  const navRefs = React.useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const path = location.pathname;
    // Handle root path specifically or others
    let activePath = path;
    if (path.startsWith('/polls/')) activePath = '/'; // Keep Home active on detail view if desired, or nothing. 
    // Actually, usually detail view doesn't highlight 'Home' or 'Polls' unless specified. 
    // Let's stick to exact matches for now, maybe map Detail to Polls.
    if (path !== '/' && path !== '/create' && path !== '/about') activePath = '/'; // Default to polls or none? 
    // Better: if it matches one of the known paths, highlight it.
    
    if (path === '/' || path.startsWith('/polls')) activePath = '/';
    if (path === '/create') activePath = '/create';
    if (path === '/about') activePath = '/about';

    const activeEl = navRefs.current[activePath];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname]);

  return (
    <nav className="navbar-glass">
      <Link to="/" className="nav-brand">
        <CubeTransparentIcon className="h-8 w-8 text-primary" style={{height: '32px', color: '#6366f1'}} />
        <span>Democrazy</span>
      </Link>
      
      <div className="nav-links">
        <div className="nav-indicator" style={indicatorStyle} />
        <Link 
          to="/" 
          className={`nav-link-item ${location.pathname === '/' || location.pathname.startsWith('/polls') ? 'active' : ''}`}
          ref={el => navRefs.current['/'] = el}
        >
          Polls
        </Link>
        <Link 
          to="/create" 
          className={`nav-link-item ${location.pathname === '/create' ? 'active' : ''}`}
          ref={el => navRefs.current['/create'] = el}
        >
          Create Poll
        </Link>
        <Link 
          to="/about" 
          className={`nav-link-item ${location.pathname === '/about' ? 'active' : ''}`}
          ref={el => navRefs.current['/about'] = el}
        >
          About
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
      <div style={{marginBottom: '1.5rem'}}>
        <a 
          href="https://github.com/RiteshJha912/democrazy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-github-star"
        >
          <FaGithub style={{fontSize: '1.1rem'}} />
          <span>Star on GitHub</span>
          <StarIcon className="star-icon-anim" style={{height: '18px'}} />
        </a>
      </div>
      <p style={{opacity: 0.8, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
        Built with <HeartIcon className="heart-beat" style={{height: '16px', color: '#ef4444'}} /> on chain by <a href="https://github.com/RiteshJha912" target="_blank" rel="noopener noreferrer" className="footer-author-link">Ritzardous</a>
      </p>
    </footer>
  );
}

export default App;
