const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    dob: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    membership: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    categories: {
      type: [String],
      default: []
    },
    address: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: "Not Uploaded"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Member", memberSchema);