const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);

module.exports = router;