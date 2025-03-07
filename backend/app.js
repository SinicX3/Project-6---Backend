const express = require('express');
const app = express();

const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/user')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/books', bookRoutes);
app.use('/auth', userRoutes);

module.exports = app;