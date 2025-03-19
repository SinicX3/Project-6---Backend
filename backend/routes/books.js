const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.delete('/:id', auth, multer, bookCtrl.deleteBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);                       

// router.get('/bestrating', bookCtrl.getBestRated);
// router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;