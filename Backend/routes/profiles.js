const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create or update profile
router.post('/', async (req, res) => {
  const {
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
    skillsWanted,
    skillsRequired,
    availability,
    bio,
    education,
    isPublic
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required.' });
  }

  try {
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.set({
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
        skillsWanted,
        skillsRequired,
        availability,
        bio,
        education,
        isPublic
      });
      await profile.save();
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile({
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
      skillsWanted,
      skillsRequired,
      availability,
      bio,
      education,
      isPublic
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error in /api/profiles POST:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 // ✅ NEW: Get all public profiles with filters and pagination
router.get('/public', async (req, res) => {
  try {
    console.log('Query params:', req.query);
    const { search = '', skill = '', availability = '', page = 1, limit = 6 } = req.query;

    const query = {
      isPublic: true,
      ...(availability && { availability }),
      ...(search && { name: { $regex: search, $options: 'i' } }),
      ...(skill && {
        $or: [
          { skillsOffered: { $regex: skill, $options: 'i' } },
          { skillsWanted: { $regex: skill, $options: 'i' } },
        ],
      }),
    };

    console.log('Constructed query:', query);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const profiles = await Profile.find(query).skip(skip).limit(parseInt(limit));
    const total = await Profile.countDocuments(query);

    res.json({ profiles, total });
  } catch (error) {
    console.error('Error fetching public profiles:', error);
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
