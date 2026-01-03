import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import '../styles/PollListModern.css'; // Import new modern styles

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    "Waking up the server from its nap...",
    "The server is running on hopes, dreams & Render's free tier...",
    "Please wait, I'm too poor for premium hosting...",
    "Connecting to the decentralized future...",
    "MetaMask is judging your wallet balance..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/polls`)
      .then(res => res.json())
      .then(data => {
        setPolls(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner"></div>
        <p className="loader-text" key={messageIndex}>{loadingMessages[messageIndex]}</p>
      </div>
    );
  }

  return (
    <div className="landing-bg-container">
      <div className="poll-list-wrapper animate-fade-up">
        <div className="hero-section">
          <h1 className="gradient-title">Community Governance</h1>
          <p className="hero-subtitle">
            Participate in the future of our ecosystem. Vote on active proposals or create your own to make your voice heard on-chain.
          </p>
        </div>
        
        <div className="polls-grid-modern">
          {polls.length === 0 ? (
            <div className="empty-modern">
              <p>No active proposals found in the ecosystem.</p>
              <Link to="/create" className="text-primary hover:text-white mt-4 inline-flex items-center gap-2 font-semibold" style={{color: '#6366f1', textDecoration: 'none'}}>
                Initialize first proposal <ArrowRightIcon style={{height: '16px'}} />
              </Link>
            </div>
          ) : (
            polls.map((poll) => {
              const totalVotes = poll.votes ? poll.votes.reduce((a,b)=>a+b, 0) : 0;
              return (
                <div key={poll.pollId} className="poll-card-modern">
                  <div className="card-top-meta">
                    <span className="status-badge active">Active</span>
                    <span>ID #{poll.pollId}</span>
                  </div>
                  
                  <h3 className="card-title">{poll.question}</h3>
                  
                  <div className="card-stats-row">
                    <div className="stat-item">
                      <span className="stat-value">{totalVotes}</span>
                      <span className="stat-label">Total Votes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{poll.options?.length || 0}</span>
                      <span className="stat-label">Options</span>
                    </div>
                  </div>

                  <Link to={`/polls/${poll.pollId}`} className="btn-card-action">
                    Vote
                    <ArrowRightIcon style={{height: '18px'}} />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PollList;
