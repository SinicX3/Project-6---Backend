const Book = require('../models/Book');

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

// exports.modifyBook = (req, res, next) => {

// };

// exports.rateBook = (req, res, next) => {
//   Book.findOne({_id: req.params.id})
//     .then(() => {
//       console.log(req.body)
//       res.status(200)
//     })
//     .catch(error => res.status(400).json({message: 'Livre non trouvé !'}))
// };