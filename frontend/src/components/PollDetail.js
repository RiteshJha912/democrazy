import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import icon
import { CONTRACT_ADDRESS, VOTING_ABI } from '../contractConfig';
import '../styles/PollDetailModern.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const PollDetail = ({ signer, account }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  // ... fetch logic similar to before ...
  const fetchPollData = useCallback(async () => {
    if(!window.ethereum) { setLoading(false); return; }
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, provider);
        const data = await contract.getPoll(id);
        setPoll({ question: data[1], options: Array.from(data[2]) });
        setVotes(Array.from(data[3]).map(v => Number(v)));
        setLoading(false);
    } catch (err) {
        console.error(err);
        setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPollData();
    const interval = setInterval(fetchPollData, 4000); // Faster refresh
    return () => clearInterval(interval);
  }, [fetchPollData]);

  const handleVote = async (index) => {
    if (!signer) return alert("Connect wallet to vote");
    try {
        setVoting(true);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
        const tx = await contract.vote(id, index);
        await tx.wait();
        fetchPollData();
    } catch (e) {
        alert("Transaction failed or rejected.");
    } finally {
        setVoting(false);
    }
  };

  if(!poll || loading) return <div className="text-center p-20 text-secondary">Loading data...</div>;

  const totalVotes = votes.reduce((a,b)=>a+b, 0);

  // Chart Config
  const chartData = {
    labels: poll.options,
    datasets: [{
      data: votes,
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(6, 182, 212, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(16, 185, 129, 0.7)'
      ],
      borderColor: 'rgba(255,255,255,0.05)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="detail-layout animate-fade-up">
      <div className="detail-header">
        <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem', fontSize: '0.9rem'}}>
          <ArrowLeftIcon style={{height: '16px'}} /> Back to Listings
        </button>
        <h1 className="detail-title">{poll.question}</h1>
        <div className="detail-meta">
          <span>ID: {id}</span>
          <span>•</span>
          <span>{totalVotes} Votes Cast</span>
        </div>
      </div>

      <div className="voting-zone">
        {poll.options.map((opt, i) => {
          const percent = totalVotes > 0 ? (votes[i] / totalVotes * 100).toFixed(1) : 0;
          return (
            <button key={i} className="vote-option-modern" onClick={() => handleVote(i)} disabled={voting}>
              <div className="progress-mesh" style={{ width: `${percent}%` }}></div>
              <span className="option-label">{opt}</span>
              <span className="option-percent">{percent}%</span>
            </button>
          );
        })}
      </div>

      <div className="stats-panel">
        <h4 className="panel-title">Real-time Distribution</h4>
        <div className="chart-container-modern">
          <Doughnut data={chartData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }} />
        </div>
      </div>
    </div>
  );
};

export default PollDetail;
