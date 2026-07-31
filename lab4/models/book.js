const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title:     { type: String, required: true, trim: true },
    author:    { type: String, required: true, trim: true },
    category:  { type: String, required: true, trim: true },
    image:     { type: String, default: "" },
    rating:    { type: Number, min: 0, max: 5, default: 5 },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);