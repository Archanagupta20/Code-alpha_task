const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
  res.json(posts);
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if(!text) return res.status(400).json({ message: 'Text required' });
    const post = await Post.create({ author: req.user._id, text });
    const populated = await post.populate('author', 'name');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like / unlike
router.post('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if(!post) return res.status(404).json({ message: 'Not found' });
  const idx = post.likes.indexOf(req.user._id);
  if(idx === -1) post.likes.push(req.user._id);
  else post.likes.splice(idx, 1);
  await post.save();
  res.json(post);
});

module.exports = router;
