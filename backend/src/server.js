const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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