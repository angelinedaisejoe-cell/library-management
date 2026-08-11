const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const Book = require("./models/Book");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// GET all books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET one book
app.get("/api/books/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(book);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// POST - add book
app.post("/api/books", async (req, res) => {
    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price
        });

        const savedBook = await book.save();

        res.status(201).json(savedBook);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// PUT - update book
app.put("/api/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                author: req.body.author,
                price: req.body.price
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(updatedBook);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// DELETE - delete book
app.delete("/api/books/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});