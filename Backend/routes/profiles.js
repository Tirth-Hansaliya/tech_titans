const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create or update profile
router.post('/', async (req, res) => {
  const {
    userId,
    name,
    location,
    profilePhoto,
    skillsOffered,
    skillsWanted,
    availability,
    isPublic
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required.' });
  }

  try {
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update
      profile.set({
        name,
        location,
        profilePhoto,
        skillsOffered,
        skillsWanted,
        availability,
        isPublic
      });
      await profile.save();
      return res.json(profile);
    }

    // Create new
    profile = new Profile({
      userId,
      name,
      location,
      profilePhoto,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error in /api/profiles POST:', error);
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
    console.error('Error in /api/profiles/:userId GET:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
