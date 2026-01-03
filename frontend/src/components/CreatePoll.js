import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, VOTING_ABI } from '../contractConfig';

const CreatePoll = ({ signer }) => {
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
    
    // Filter out empty options
    const validOptions = options.filter(o => o.trim() !== "");
    if (validOptions.length < 2) return alert("At least 2 valid options are required.");

    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
      const tx = await contract.createPoll(question, validOptions);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      alert("Poll created successfully!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Error creating poll. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4 text-center">Create New Poll</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Poll Question</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={question} 
                  onChange={e => setQuestion(e.target.value)} 
                  placeholder="e.g. What is your favorite color?"
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Options (2-5)</label>
                {options.map((opt, i) => (
                  <div key={i} className="input-group mb-2">
                    <span className="input-group-text">#{i + 1}</span>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={opt} 
                      onChange={e => handleOptionChange(i, e.target.value)} 
                      placeholder={`Option ${i+1}`} 
                      required 
                    />
                     {options.length > 2 && (
                        <button type="button" className="btn btn-outline-danger" onClick={() => removeOption(i)}>X</button>
                     )}
                  </div>
                ))}
                {options.length < 5 && (
                  <button type="button" className="btn btn-sm btn-outline-secondary w-100" onClick={addOption}>
                    + Add Another Option
                  </button>
                )}
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Transaction...
                    </>
                  ) : "Create Poll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
