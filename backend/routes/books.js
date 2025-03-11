const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books')
const auth = require('../middleware/auth')

router.get('/books', auth, bookCtrl.getAllBooks);
router.post('/books', auth, bookCtrl.createBook);

module.exports = router;