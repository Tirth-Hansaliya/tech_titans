import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const PAGE_SIZE = 6;

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
    );
  }
  return <span>{stars}</span>;
}

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [availability, setAvailability] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search, skill, availability, page]);

  async function fetchUsers() {
    setError('');
    try {
      const params = new URLSearchParams({
        search,
        skill,
        availability,
        page,
        limit: PAGE_SIZE,
      });
      const res = await fetch(`/api/profiles/public?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      setUsers(data.profiles);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="home-container">
      <h1>Skill Swap Platform</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by skill..."
          value={skill}
          onChange={e => setSkill(e.target.value)}
        />
        <select value={availability} onChange={e => setAvailability(e.target.value)}>
          <option value="">All Availability</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="user-list">
        {users.map(user => (
          <div className="user-card" key={user._id}>
            <div className="profile-photo">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" />
              ) : (
                <div className="placeholder">No Photo</div>
              )}
            </div>
            <div className="user-info">
              <h2>{user.name}</h2>
              {user.location && <div className="location">{user.location}</div>}
              <div className="skills">
                <span className="label">Skills Offered:</span> {user.skillsOffered.join(', ')}
              </div>
              <div className="skills">
                <span className="label">Skills Wanted:</span> {user.skillsWanted.join(', ')}
              </div>
              <div className="availability">Availability: {user.availability}</div>
              <div className="rating">
                <StarRating rating={Math.round(user.rating)} />
                <span className="rating-value">({user.rating ? user.rating.toFixed(1) : '0.0'})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? 'active' : ''}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
