const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  rating: { type: Number, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema);