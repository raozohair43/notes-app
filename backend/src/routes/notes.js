const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const note = new Note({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      isPinned: !!isPinned,
      userId: req.user.userId
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all notes (with pagination)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [notes, total] = await Promise.all([
      Note.find({ userId: req.user.userId })
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Note.countDocuments({ userId: req.user.userId })
    ]);
    res.json({ notes, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single note by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a note by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, tags: Array.isArray(tags) ? tags : [], isPinned: !!isPinned },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a note by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 