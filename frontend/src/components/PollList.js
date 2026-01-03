import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/polls')
      .then(res => {
          if (!res.ok) throw new Error("Failed to fetch polls");
          return res.json();
      })
      .then(data => {
        setPolls(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load polls. Ensure backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
      <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
          </div>
      </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2>Active Polls</h2>
        </div>
        <div className="col-auto">
             <button className="btn btn-sm btn-outline-secondary" onClick={() => window.location.reload()}>Refresh</button>
        </div>
      </div>
      
      <div className="row">
        {polls.length === 0 ? (
            <div className="col-12 text-center p-5 bg-light rounded">
                <p className="text-muted mb-0">No polls found. Be the first to create one!</p>
            </div>
        ) : (
          polls.map(poll => (
            <div className="col-md-6 col-lg-4 mb-4" key={poll._id || poll.pollId}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-dark">{poll.question}</h5>
                  <p className="card-text text-muted small">
                    Poll ID: #{poll.pollId} <br/>
                    Total Votes: {poll.votes ? poll.votes.reduce((a,b)=>a+b, 0) : 0}
                  </p>
                  <Link to={`/polls/${poll.pollId}`} className="btn btn-primary w-100 mt-2">
                    Vote Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PollList;
