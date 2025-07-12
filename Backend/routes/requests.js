const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth'); // Assuming you have auth middleware

// Create a new request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }
    const senderId = req.user._id;

    // Prevent sending request to self
    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({ sender: senderId, receiver: receiverId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = new Request({
      sender: senderId,
      receiver: receiverId,
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all requests received by logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const receiverId = req.user._id;
    const requests = await Request.find({ receiver: receiverId, status: 'pending' })
      .populate('sender', 'name profilePhoto');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
