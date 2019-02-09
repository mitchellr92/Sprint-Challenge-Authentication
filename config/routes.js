const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/dbHelpers');

const { authenticate, generateToken } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  db.insertUser(user)
    .then(user => {
      res.status(201).json({ message: 'You are now registered!' })
    })
    .catch(err => {
      res.status(500).json({ message: 'Failure to register new account' });
    })
}

function login(req, res) {
  const loggedInUser = req.body;

  db.userLogin(loggedInUser.username)
    .then(user => {
      if (user && bcrypt.compareSync(loggedInUser.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: 'You are logged in!' })
      } else {
        res.status(404).json({ message: 'Incorrect username or password' })
      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
