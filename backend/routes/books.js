const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.delete('/:id', auth, multer, bookCtrl.deleteBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);                        // Pour qu'un utilisateur authentifié puisse modifier ses livres
router.put('/:id', auth, bookCtrl.rateBook);                                           // Pour qu'un utilisateur authentifié puisse noter des livres

module.exports = router;