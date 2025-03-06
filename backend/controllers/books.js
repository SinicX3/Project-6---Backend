const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
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
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};



