const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/books')

router.get('/books', bookCtrl.getAllBooks);
router.post('/books', bookCtrl.createBook);

module.exports = router;

