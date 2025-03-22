const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp'); 

exports.createBook = (req, res, next) => {
  const newBookObject = JSON.parse(req.body.book);
 
                            // Intégrer sharp ici
 
  const newBook = new Book({
    ...newBookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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

exports.deleteBook = (req, res, next) => {                                          // Actuellement, les images ne sont pas supprimées du dossier de backend à la suppression
  Book.findOne({_id: req.params.id})
    .then(book => {
      console.log(book)
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

exports.rateBook = (req, res, next) => {                      
  Book.findOne({_id: req.params.id})
  .then((book) => {
    Book.updateOne({_id: req.params.id}, {
        $push: {ratings: {userId: req.body.userId, grade: req.body.rating}},
        $set: {averageRating: (
          (req.body.rating + (book.ratings?.reduce((sum, r) => sum + r.grade, 0) || 0)) / ((book.ratings?.length || 0) +1)                  // Il faut arrondir au supérieur
        )}
        })
    .then(() => res.status(200).json(book))                                 // Actuellement, on peut voter deux fois un même livre
    .catch((error) => res.status(401).json({message: {error}}))
  })
  .catch((error) => res.status(401).json({message: {error}}));
};
  
exports.getBestRated = (req, res, next) => {
  Book.find().sort({averageRating: -1, year: -1}).limit(3)                              //Si deux livres ont EXACTEMENT la même note moyenne, on choisit le plus récent
    .then((books) => {
      res.status(200).json(books)
    })
    .catch(error => res.status(400).json({ error }));
};
