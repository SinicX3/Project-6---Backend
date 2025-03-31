const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');                        // Est-ce qu'il ne faudrait pas plutôt importer auth.js ?

exports.signup =                               
};

exports.login = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user === null) {
        res.status(401).json({message: "Paire identifiant/mot de passe incorrect"});
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              res.status(401).json({message: "Paire identifiant/mot de passe incorrect"});
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  {userId: user._id}, 
                  'RANDOM_TOKEN_SECRET',
                  {expiresIn: '24h'}
                )
              })
            }
          })
          .catch(error => {
            res.status(500).json({error});
            console.log("erreur est :", {error});
          })
      }
    })
    .catch(error => {
      res.status(500).json({error});
    })
};