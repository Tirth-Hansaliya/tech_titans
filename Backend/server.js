const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
require('dotenv').config();
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mernapp';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
