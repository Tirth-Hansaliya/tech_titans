import React, { useEffect, useRef, useState } from 'react';
import './Profile.css';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
    );
  }
  return <span>{stars}</span>;
}

function TagsInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState('');
  const inputRef = useRef();

  function handleKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  }

  return (
    <div className="tags-input">
      {tags.map((tag, i) => (
        <span className="tag" key={i}>
          {tag}
          <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))}>×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        placeholder={placeholder}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default function Profile() {
  const userId = localStorage.getItem('userId');
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
      setError('');
      try {
        const res = await fetch(`/api/profiles/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const user = await res.json();
        setName(user.name || '');
        setLocation(user.location || '');
        setProfilePhoto(user.profilePhoto || '');
        setSkillsOffered(user.skillsOffered || []);
        setSkillsWanted(user.skillsWanted || '');
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

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function validate() {
    if (!name.trim()) return 'Name is required.';
    if (skillsOffered.length === 0) return 'At least one skill offered is required.';
    if (skillsWanted.length === 0) return 'At least one skill wanted is required.';
    return '';
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      let res;
      if (!userId) {
        // Create new user
        res = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId, // <-- must be set from logged-in user
            name,
            location,
            profilePhoto,
            skillsOffered,
            skillsWanted,
            availability,
            isPublic,
          }),
        });
        if (!res.ok) throw new Error('Failed to create profile');
        const newUser = await res.json();
        setUserId(newUser._id);
        setSuccess('Profile created successfully!');
      } else {
        // Update existing user
        res = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            location,
            profilePhoto,
            skillsOffered,
            skillsWanted,
            availability,
            isPublic,
          }),
        });
        if (!res.ok) throw new Error('Failed to update profile');
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="profile-container"><div>Loading...</div></div>;

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {profilePhoto && <img src={profilePhoto} alt="Profile Preview" className="photo-preview" />}
        </div>
        <div className="form-group">
          <label>Skills Offered *</label>
          <TagsInput tags={skillsOffered} setTags={setSkillsOffered} placeholder="Add a skill and press Enter" />
        </div>
        <div className="form-group">
          <label>Skills Wanted *</label>
          <TagsInput tags={skillsWanted} setTags={setSkillsWanted} placeholder="Add a skill and press Enter" />
        </div>
        <div className="form-group">
          <label>Availability</label>
          <select value={availability} onChange={e => setAvailability(e.target.value)}>
            <option value="">Select</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
          </select>
        </div>
        <div className="form-group toggle-group">
          <label>Public Profile</label>
          <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        </div>
        <div className="form-group">
          <label>Average Rating</label>
          <div>
            <StarRating rating={Math.round(rating)} />
            <span className="rating-value">({rating ? rating.toFixed(1) : '0.0'}) from {ratingCount} ratings</span>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button className="save-btn" type="submit">Save / Update</button>
      </form>
    </div>
  );
}