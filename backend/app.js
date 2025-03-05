const express = require('express');
const Book = require('./models/Book')
const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/books', (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});


app.post('/books', (req, res, next) => {
  const newBook = new Book({
    rating: 3,
    title: "Milwaukee mission",
    author: "Elder Cooper",
    type: "Policier",
    year: 2021,
    picture: "picture.png"
  });
  newBook.save()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});


module.exports = app;