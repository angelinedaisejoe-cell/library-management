const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// GET /api/books -- optional ?search=&field=title|author|category, used by index1.html
router.get('/', async (req, res) => {
  const { search, field } = req.query;
  let query = {};

  if (search) {
    const key = field === 'Author' ? 'author' : field === 'Category' ? 'category' : 'title';
    query[key] = { $regex: search, $options: 'i' };
  }

  const books = await Book.find(query).sort({ createdAt: -1 });
  res.json(books);
});

// POST /api/books -- add a new book (e.g. from an admin page)
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Could not add book.', error: err.message });
  }
});

module.exports = router;