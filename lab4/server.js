require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Member = require("./models/members");
const Book = require("./models/book");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve static frontend files from the same directory
app.use(express.static(path.join(__dirname)));

// ── Database Connection ─────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected to libraryms"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/register — create a new member account
app.post("/api/register", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ message: "Member Registered Successfully", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/login — plain-text password check
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email, password });
    if (!member) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    res.json({ message: "Login Successful", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// MEMBER CRUD ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/members — list all members
app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/members/:id — get a single member
app.get("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/members/:id — update a member
app.put("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/members/:id — delete a member
app.delete("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// BOOK CRUD ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/books — list all books (optional ?search=&field=title|author|category)
app.get("/api/books", async (req, res) => {
  try {
    const { search, field } = req.query;
    let query = {};
    if (search) {
      const key = field === "Author" ? "author" : field === "Category" ? "category" : "title";
      query[key] = { $regex: search, $options: "i" };
    }
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books — add a new book
app.post("/api/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: "Could not add book.", error: err.message });
  }
});

// PUT /api/books/:id — update a book
app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/books/:id — delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});