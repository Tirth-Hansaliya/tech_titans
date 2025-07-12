import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile() {
  const storedUserId = localStorage.getItem('userId');
  const [userId, setUserId] = useState(storedUserId || null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [availability, setAvailability] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(`/api/profiles/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const user = await res.json();
        setName(user.name || '');
        setLocation(user.location || '');
        setProfilePhoto(user.profilePhoto || '');
        setSkillsOffered(user.skillsOffered || []);
        setSkillsWanted(user.skillsWanted || []);
        setAvailability(user.availability || '');
        setIsPublic(user.isPublic !== false);
        setRating(user.rating || 0);
        setRatingCount(user.ratingCount || 0);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Name is required.');
    if (skillsOffered.length === 0) return setError('At least one skill offered is required.');
    if (skillsWanted.length === 0) return setError('At least one skill wanted is required.');
    if (!userId) return setError('userId is missing in localStorage.');

    try {
      let res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          location,
          profilePhoto,
          skillsOffered,
          skillsWanted,
          availability,
          isPublic,
        }),
      });

      if (!res.ok) throw new Error('Failed to save profile');
      const updated = await res.json();
      setUserId(updated.userId);
      setSuccess('Profile saved successfully!');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSave} className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Profile Photo URL:</label>
          <input value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} />
          {profilePhoto && (
            <img src={profilePhoto} alt="Profile Preview" className="photo-preview" />
          )}
        </div>

        <div className="form-group">
          <label>Skills Offered (comma separated):</label>
          <input
            value={skillsOffered.join(', ')}
            onChange={(e) => setSkillsOffered(e.target.value.split(',').map(s => s.trim()))}
          />
        </div>

        <div className="form-group">
          <label>Skills Wanted (comma separated):</label>
          <input
            value={skillsWanted.join(', ')}
            onChange={(e) => setSkillsWanted(e.target.value.split(',').map(s => s.trim()))}
          />
        </div>

        <div className="form-group">
          <label>Availability:</label>
          <input value={availability} onChange={(e) => setAvailability(e.target.value)} />
        </div>

        <div className="form-group toggle-group">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public Profile
          </label>
        </div>

        <div className="form-group">
          <label>Rating:</label>
          <span className="rating-value">{rating} ⭐ ({ratingCount} reviews)</span>
        </div>

        <button type="submit" className="save-btn">Save Profile</button>
      </form>
    </div>
  );
}
