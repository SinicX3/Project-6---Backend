const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  console.log(req.body);
  const newBook = new Book({
    // rating: 3,
    // title: "Milwaukee mission",
    // author: "Elder Cooper",
    // type: "Policier",
    // year: 2021,
    // picture: "picture.png"
    rating: req.body.rate,
    title: req.body.title,
    author: req.body.author,
    type: req.body.genre,
    year: req.body.year,
    picture: "picture.png"
  });
  console.log(newBook);
  // newBook.save()
  //   .then(books => res.status(200).json(books))
  //   .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};
