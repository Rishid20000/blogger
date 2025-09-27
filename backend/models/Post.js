const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: {
    type: String,
    default: null
  },
  userId: Number,
  comments: [
    {
      userId: Number,
      comment: String
    }
  ],
  likes: [Number]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
