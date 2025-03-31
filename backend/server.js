const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // On charge la connexion à mongoDB avec un fichier .env.
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.set('port', process.env.PORT || 4000);
const server = http.createServer(app);

server.listen(process.env.PORT || 4000);