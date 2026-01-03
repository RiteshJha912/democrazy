import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CONTRACT_ADDRESS, VOTING_ABI } from '../contractConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollDetail = ({ signer, account }) => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fetchPollData = useCallback(async () => {
    if(!window.ethereum) {
        setLoading(false);
        return; 
    }
    
    try {
        // Use a simple provider for reading if signer not available, or browser provider.
        // We'll just use BrowserProvider basic (read-only if no signer)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, provider);
        
        const data = await contract.getPoll(id);
        // data structure: [id, question, options, votes]
        
        setPoll({
            question: data[1],
            options: Array.from(data[2])
        });
        setVotes(Array.from(data[3]).map(v => Number(v)));
        setLoading(false);
    } catch (err) {
        console.error("Error fetching poll from chain:", err);
        // Fallback or just stop loading
        setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPollData();
    const interval = setInterval(fetchPollData, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, [fetchPollData]);

  const handleVote = async (index) => {
    if (!signer) return alert("Please connect your wallet first!");
    
    try {
        setVoting(true);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
        const tx = await contract.vote(id, index);
        console.log("Vote tx:", tx.hash);
        await tx.wait();
        alert("Vote cast successfully!");
        fetchPollData();
    } catch (e) {
        console.error(e);
        // Extract reason if possible
        let message = e.message;
        if(e.reason) message = e.reason;
        if(message.includes("Already voted")) message = "You have already voted in this poll.";
        alert("Transaction failed: " + message);
    } finally {
        setVoting(false);
    }
  };

  if(loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div><p>Loading chain data...</p></div>;
  if(!poll) return <div className="alert alert-warning m-5">Poll not available or contract not connected. Ensure you are on Sepolia and the contract address is correct.</div>;

  const chartData = {
    labels: poll.options,
    datasets: [
      {
        label: 'Vote Count',
        data: votes,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container">
        <div className="row my-4">
            <div className="col-lg-5 mb-4">
                <div className="card shadow border-0">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Cast Your Vote</h4>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title mb-3">{poll.question}</h5>
                        <p className="text-muted small">Poll ID: {id}</p>
                        
                        <div className="d-grid gap-3">
                            {poll.options.map((opt, i) => (
                                <button 
                                    key={i} 
                                    className="btn btn-outline-dark text-start p-3 d-flex justify-content-between align-items-center position-relative overflow-hidden" 
                                    onClick={() => handleVote(i)} 
                                    disabled={voting}
                                >
                                    <span style={{zIndex: 1}}>{opt}</span>
                                    {/* Simple progress bar background effect */}
                                    <div 
                                        className="position-absolute h-100 start-0 top-0 bg-light" 
                                        style={{
                                            width: `${votes.reduce((a,b)=>a+b,0) > 0 ? (votes[i]/votes.reduce((a,b)=>a+b,0))*100 : 0}%`, 
                                            opacity: 0.5, 
                                            zIndex: 0
                                        }} 
                                    />
                                    <span className="badge bg-primary rounded-pill" style={{zIndex: 1}}>{votes[i]}</span>
                                </button>
                            ))}
                        </div>
                        
                        {voting && <div className="mt-3 text-center text-info"><small>Confirming transaction...</small></div>}
                    </div>
                </div>
            </div>

            <div className="col-lg-7">
                <div className="card shadow border-0">
                    <div className="card-header bg-white">
                        <h4 className="mb-0">Live Results</h4>
                    </div>
                    <div className="card-body">
                         <Bar 
                            data={chartData} 
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: true, text: 'Real-time On-Chain Data' }
                                },
                                scales: {
                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                }
                            }} 
                         />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PollDetail;
