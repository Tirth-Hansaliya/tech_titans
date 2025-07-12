const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: String,
  gender: String,
  dob: Date,
  email: String,
  phoneNumber: String,
  linkedin: String,
  github: String,
  location: String,
  profilePhoto: String,
  skillsOffered: [String],
  skillsWanted: [String],
  skillsRequired: [String],
  availability: String,
  bio: String,
  education: {
    qualification: String,
    universityName: String,
    departmentName: String,
    percentage12th: String,
    currentCgpa: String
  },
  isPublic: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Profile', ProfileSchema);