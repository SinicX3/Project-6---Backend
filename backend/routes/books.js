const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books')
const auth = require('../middleware/auth')                    

router.get('/', bookCtrl.getAllBooks);
router.post('/', bookCtrl.createBook);                 // Remettre "auth" une fois que les routes seront valables

module.exports = router;