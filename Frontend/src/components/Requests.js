import React, { useEffect, useState } from 'react';
import Header from './Header';
import './Requests.css';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      setError('');
      setLoading(true);
      try {
        const res = await fetch('/api/requests', {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed, e.g. token from localStorage
            // 'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  return (
    <>
      <Header />
      <div className="requests-container">
        <h1>Received Requests</h1>
        {loading && <p>Loading requests...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && requests.length === 0 && <p>No requests found.</p>}
        <ul className="requests-list">
          {requests.map(request => (
            <li key={request._id} className="request-item">
              <div className="sender-photo">
                {request.sender.profilePhoto ? (
                  <img src={request.sender.profilePhoto} alt={request.sender.name} />
                ) : (
                  <div className="placeholder">No Photo</div>
                )}
              </div>
              <div className="request-info">
                <p><strong>{request.sender.name}</strong> has sent you a request.</p>
                <p>Status: {request.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
