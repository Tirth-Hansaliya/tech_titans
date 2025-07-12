import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile() {
  const storedUserId = localStorage.getItem('userId');
  const [userId, setUserId] = useState(storedUserId || null);

  // Tab state
  const [activeTab, setActiveTab] = useState('personal');

  // Personal Information states
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [location, setLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [availability, setAvailability] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Educational Information states
  const [qualification, setQualification] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [percentage12th, setPercentage12th] = useState('');
  const [currentCGPA, setCurrentCGPA] = useState('');

  // Other states
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
        const res = await fetch('/api/profiles/' + userId);
        if (!res.ok) throw new Error('Failed to fetch user');
        const user = await res.json();
        setName(user.name || '');
        setGender(user.gender || '');
        setDob(user.dob ? user.dob.split('T')[0] : '');
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
        setLinkedin(user.linkedin || '');
        setGithub(user.github || '');
        setLocation(user.location || '');
        setProfilePhoto(user.profilePhoto || '');
        setSkillsOffered(user.skillsOffered || []);
        setSkillsRequired(user.skillsRequired || []);
        setAvailability(user.availability || '');
        setBio(user.bio || '');
        setIsPublic(user.isPublic !== false);
        setRating(user.rating || 0);
        setRatingCount(user.ratingCount || 0);

        // Educational info
        const education = user.education || {};
        setQualification(education.qualification || '');
        setUniversityName(education.universityName || '');
        setDepartmentName(education.departmentName || '');
        setPercentage12th(education.percentage12th || '');
        setCurrentCGPA(education.currentCGPA || '');
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
    if (skillsRequired.length === 0) return setError('At least one skill required is required.');
    if (!userId) return setError('userId is missing in localStorage.');

    try {
      let res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          gender,
          dob,
          email,
          phoneNumber,
          linkedin,
          github,
          location,
          profilePhoto,
          skillsOffered,
          skillsRequired,
          availability,
          bio,
          isPublic,
          education: {
            qualification,
            universityName,
            departmentName,
            percentage12th,
            currentCGPA,
          },
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

      <div className="tabs">
        <button
          className={activeTab === 'personal' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('personal')}
          type="button"
        >
          Personal Information
        </button>
        <button
          className={activeTab === 'education' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('education')}
          type="button"
        >
          Educational Information
        </button>
      </div>

      <form onSubmit={handleSave} className="profile-form">
        {activeTab === 'personal' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth:</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>

            <div className="form-group">
              <label>LinkedIn:</label>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </div>

            <div className="form-group">
              <label>GitHub:</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Skills Required (comma separated):</label>
              <input
                value={skillsRequired.join(', ')}
                onChange={(e) => setSkillsRequired(e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            <div className="form-group">
              <label>Skills Offered (comma separated):</label>
              <input
                value={skillsOffered.join(', ')}
                onChange={(e) => setSkillsOffered(e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            <div className="form-group">
              <label>Availability:</label>
              <input value={availability} onChange={(e) => setAvailability(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Bio:</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
            </div>

            <div className="form-group">
              <label>Profile Photo URL:</label>
              <input value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} />
              {profilePhoto && (
                <img src={profilePhoto} alt="Profile Preview" className="photo-preview" />
              )}
            </div>
          </>
        )}

        {activeTab === 'education' && (
          <>
            <div className="form-group">
              <label>Qualification:</label>
              <input value={qualification} onChange={(e) => setQualification(e.target.value)} />
            </div>

            <div className="form-group">
              <label>University Name:</label>
              <input value={universityName} onChange={(e) => setUniversityName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Department Name:</label>
              <input value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Percentage of 12th:</label>
              <input value={percentage12th} onChange={(e) => setPercentage12th(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Current CGPA:</label>
              <input value={currentCGPA} onChange={(e) => setCurrentCGPA(e.target.value)} />
            </div>
          </>
        )}

        <button type="submit" className="save-btn">Save Profile</button>
      </form>
    </div>
  );
}
