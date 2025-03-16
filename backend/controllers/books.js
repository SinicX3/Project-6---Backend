const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  const newBookObject = JSON.parse(req.body.book);
  const newBook = new Book({
    ...newBookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ratings: newBookObject.ratings,
    averageRating: 0,
    owner: req.auth.userId
  })
  newBook.save()
    .then(books => res.status(200).json("Livre ajouté avec succès !"))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBook = (req, res, next) => {
  Book.findOne({id: req.params._id})                              
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}; 