import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { PlusIcon, XMarkIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { CONTRACT_ADDRESS, VOTING_ABI } from '../contractConfig';
import '../styles/CreatePollModern.css'; // New styles

const CreatePoll = ({ signer, account }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) return alert("Please connect your wallet first!");
    
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
      const tx = await contract.createPoll(question, options.filter(o => o.trim() !== ""));
      await tx.wait();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-wrapper animate-fade-up">
      <div className="hero-section" style={{marginBottom: '2rem'}}>
        <h1 className="gradient-title" style={{fontSize: '2.5rem'}}>New Proposal</h1>
        <p className="hero-subtitle">Define a new question for the community to vote on.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="modern-input-group">
            <label className="modern-label">Proposition Question</label>
            <input 
              type="text" 
              className="modern-input" 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              placeholder="e.g. Should we implement EIP-1559?"
              required 
            />
          </div>
          
          <div className="modern-input-group">
            <label className="modern-label">Voting Options</label>
            {options.map((opt, i) => (
              <div key={i} className="option-row">
                <span className="option-index">{i + 1}</span>
                <input 
                  type="text" 
                  className="modern-input" 
                  value={opt} 
                  onChange={e => handleOptionChange(i, e.target.value)} 
                  placeholder={`Option ${i+1}`} 
                  required 
                />
                {options.length > 2 && (
                  <button type="button" className="btn-icon-action" onClick={() => removeOption(i)}>
                    <XMarkIcon style={{height: '20px'}} />
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 5 && (
              <button type="button" className="btn-add-modern" onClick={addOption} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                <PlusIcon style={{height: '18px'}} /> Add another option
              </button>
            )}
          </div>

          <button type="submit" className="btn-submit-modern" disabled={loading} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            {loading ? "Confirming on-chain..." : (
              <>
                 <RocketLaunchIcon style={{height: '20px'}} /> Submit Proposal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
