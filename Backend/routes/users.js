const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create new user
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      // Update existing user
      user.set(req.body);
      await user.save();
      return res.json(user);
    }
    // Create new user
    user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;