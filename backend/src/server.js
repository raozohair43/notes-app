const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'https://notes-app-1-ehg5.onrender.com',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Notes App API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
