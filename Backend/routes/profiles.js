const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { useState } = require('react');

// At the top of your Profile component
const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

// Create or update profile
router.post('/', async (req, res) => {
  const { userId } = req.body; // userId comes from frontend
  try {
    const profileData = req.body;
    let profile = await Profile.findOne({ userId });
    if (profile) {
      profile.set(profileData);
      await profile.save();
      return res.json(profile);
    }
    profile = new Profile({ userId, ...profileData });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error in /api/profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;