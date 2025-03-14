const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  const newBookObject = JSON.parse(req.body.book);
  console.log(newBookObject)
  const newBook = new Book({
    ...newBookObject,
    picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ratings: newBookObject.ratings,
    averageRating: 0
  })
  console.log(newBook);
  newBook.save()
    .then(books => res.status(200).json("Livre ajouté avec succès !"))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};


// exports.createThing = (req, res, next) => {
//   const thingObject = JSON.parse(req.body.thing);
//   delete thingObject._id;
//   delete thingObject._userId;
//   const thing = new Thing({
//     ...thingObject,
//     userId: req.auth.userId,
//     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//   })

//   thing.save()
//   .then(() => {res.status(201).json({message: 'Objet enregistré'})})
//   .catch(error => {res.status(400).json({error})})
// }