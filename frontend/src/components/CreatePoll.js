import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { PlusIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { CONTRACT_ADDRESS, VOTING_ABI } from '../contractConfig';
import { containsBadWords } from '../utils/contentFilter';
import '../styles/CreatePollModern.css';

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
    
    // Content Moderation Check
    if (containsBadWords(question)) {
      alert("⚠️ Your question contains inappropriate language. Please keep the environment civil.");
      return;
    }

    const validOptions = options.filter(o => o.trim() !== "");
    for (let opt of validOptions) {
      if (containsBadWords(opt)) {
        alert(`⚠️ Option "${opt}" contains inappropriate language.`);
        return;
      }
    }
    
    try {
      setLoading(true);
      // Renamed variable to avoid potential linter confusion
      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
      
      if (validOptions.length < 2) return alert("Please provide at least 2 valid options.");

      const tx = await votingContract.createPoll(question, validOptions);
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
      <div className="hero-section" style={{marginBottom: '3rem'}}>
        <h1 className="gradient-title" style={{fontSize: '3rem'}}>New Proposal</h1>
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
              <button type="button" className="btn-add-modern" onClick={addOption}>
                <PlusIcon style={{height: '18px'}} /> Add another option
              </button>
            )}
          </div>

          <button type="submit" className="btn-submit-modern" disabled={loading} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'}}>
            {loading ? "Confirming on-chain..." : (
              <>
                 <PaperAirplaneIcon style={{height: '24px'}} /> Submit Proposal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
