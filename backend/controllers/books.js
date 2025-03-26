const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp'); 

exports.createBook = (req, res, next) => {
  const newBookObject = JSON.parse(req.body.book);
  fs.access("./images", (error) => {
    if (error) {
      fs.mkdirSync("./images");
    }});
  const timestamp = Date.now();
  const fileName = `optimized-${timestamp}.webp`
  sharp(req.file.buffer)
    .webp({ quality: 20 })
    .toFile(`./images/${fileName}`)
    .then(() =>
      {const newBook = new Book({
        ...newBookObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${fileName}`
      })
      newBook.save()
        .then(books => res.status(200).json("Livre ajouté avec succès !"))
        .catch(error => res.status(400).json({ error }));
    })
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

exports.modifyBook = async (req, res, next) => {
  // On vérifie que le user est le propriétaire du livre
  Book.findById(req.params.id)
    .then(async (book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized request" });
      }

      img = book.imageUrl

      if (req.file) {
        const bookObject = JSON.parse(req.body.book);
        const timestamp = Date.now();
        const fileName = `optimized-${timestamp}.webp`
        bookObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

        await sharp(req.file.buffer)
        .webp({ quality: 20 })
        .toFile(`./images/${fileName}`)
        .then(() => {
          Book.findOneAndUpdate({_id: req.params.id}, {...bookObject})
            .then(() => res.status(200).json({message: "Livre modifié !"}))
            .catch((error) => res.status(401).json({message: {error}}))
          })
      } else {
        const bookObject = req.body;
        bookObject.imageUrl = img
        Book.findOneAndUpdate({_id: req.params.id}, {...bookObject, img})
          .then((book) => {
            console.log('test', book)
            res.status(200).json({message: "Livre modifié !"})})
          .catch((error) => res.status(401).json({message: {error}}))
      }

      })
    .catch((error) => {
      console.log(error.message)
      res.status(403).json({error})
    });
  };

exports.rateBook = (req, res, next) => { 
  Book.findOne({_id: req.params.id})
  .then((book) => {
    if (book.ratings.includes(req.body.userId)) {
      res.status(401).json({message: "Cet utilisateur a déjà voté ce livre !"})
    } 
    else {  
    Book.findOneAndUpdate({_id: req.params.id}, {
      $push: {ratings: {userId: req.body.userId, grade: req.body.rating}},
      $set: {averageRating: (
        Math.round((req.body.rating + (book.ratings?.reduce((sum, r) => sum + r.grade, 0) || 0)) / ((book.ratings?.length || 0) +1))   // On arrondit au supérieur
      )}
      }, { new: true })
    .then(book => res.status(200).json(book))
    .catch((error) => res.status(401).json({message: {error}}))
    }
  }
  )
  .catch((error) => res.status(403).json({message: {error}}));
}
  
exports.getBestRated = (req, res, next) => {
  Book.find().sort({averageRating: -1, year: -1}).limit(3)                              //Si deux livres ont la même note moyenne, on choisit le plus récent
    .then((books) => {
      res.status(200).json(books)
    })
    .catch(error => res.status(400).json({ error }));
};
