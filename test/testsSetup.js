const express = require('express');
const restricted = require('../source/index');

const server = express();

const config = {
  reqProp: 'headers',
  childProp: 'authorization',
  identifier: 'user_type',
  jwtKey: 'RandomSecretString'
};
const access = {
  admin: 'admin',
  users: ['admin', 'user'],
  loggedIn: []
};

server.get('/', restricted(config, access.loggedIn), (req, res) => {
  res.status(200).json({ message: 'Endpoint available to logged in users' });
});

server.get('/admin', restricted(config, access.admin), (req, res) => {
  res.status(200).json({ message: 'Secret API available to admin only' });
});

server.get('/users', restricted(config, access.users), (req, res) => {
  res.status(200).json({ message: 'Endpoint available to admin and user' });
});

server.get(
  '/undefinedReqProp',
  restricted(config, access.loggedIn),
  (req, res) => {
    res.status(200).json({ message: 'You should not get this message' });
  }
);

module.exports = {
  config,
  access,
  server
};
