const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const newBookObject = JSON.parse(req.body.book);
  const newBook = new Book({
    ...newBookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ratings: newBookObject.ratings,
    averageRating: 0,
    userId: req.auth.userId
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
  Book.findOne({_id: req.params.id})                              
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({_id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: "Non-autorisé"});
      } else {
        const filename = book.imageUrl.split('./images/') [1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
            .then (() => {res.status(200).json({message: 'Objet supprimé !'})})
            .catch (error => res.status(401).json({error}));
        })
      }
    })
    .catch(error => {res.status(500).json({error})});
};

exports.modifyBook = (req, res, next) => {
    // On vérifie que le user est le propriétaire du livre
    Book.findById(req.params.id)
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized request" });
      }
      
      const BookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      } : {...req.body};
  
        delete BookObject._userId;
         Book.findOne({_id: req.params.id})
        .then((book) => {
        if (book.userId !== req.auth.userId) {
          res.status(401).json({message : "Non-autorisé"});
      } else {
        Book.updateOne({_id: req.params.id}, {...BookObject, _id: req.params.id})
          .then(() => res.status(200).json({message: "Livre modifié !"}))
          .catch((error) => res.status(401).json({message: {error}}))
      }
    })})
  .catch((error) => res.status(401).json({message: {error}}))};

  exports.rateBook =(req, res, next) => {
    
  }