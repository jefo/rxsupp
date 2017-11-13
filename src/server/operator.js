const io = require('socket.io-client');
const { users, operators } = require('./index');

module.exports = io('http://localhost:3000');
