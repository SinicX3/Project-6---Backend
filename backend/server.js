const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://benoitthery36:2WZkdGVDpJdqhgtz@cluster0.i9hov.mongodb.net/books',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.set('port', process.env.PORT || 4000);
const server = http.createServer(app);

server.listen(process.env.PORT || 4000);