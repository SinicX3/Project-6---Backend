const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books')
const auth = require('../middleware/auth')                    

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, bookCtrl.createBook);                 

module.exports = router;