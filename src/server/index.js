const io = require('socket.io')(3000);
const usersRepository = require('./usersRepository');

const operators = ['jefo.operator@gmail.com'];

const messages = {};
let counter = 0;
let ticketId;
// todo: operator chat version with incoming messages
// add list of client rooms with active messages
io.on('connection', (socket) => {

    const socketConnections = [];

    let currentUser = usersRepository.findBySocketId(socket.id);
    if (!currentUser) {
        if (!ticketId) {
            ticketId = new Date().getTime().toString();
        }
        currentUser = {
            ticketId,
            login: socket.id,
            isOnline: true
        };
    } else {
        currentUser.isOnline = true;
        currentUser.ticketId = ticketId;
    }

    usersRepository.addOrUpdate(currentUser);

    socket.join(ticketId);

    io.in(ticketId).emit('ADD_USER', { messages, users });

    socket.on('SEND_MESSAGE', (msg) => {
        messages[msg.timestamp] = msg;
        console.log('ADD_MESSAGE:', msg.text);
        socket.broadcast.to(ticketId).emit('ADD_MESSAGE', msg);
    });

    socket.on('USER_LOGIN', (user) => {
        user.isOperator = operators.some(login => user.login === login);
        usersRepository.addOrUpdate(user);
        io.in(ticketId).emit('USER_LOGIN', user);
    });

    socket.on('CONNECT_WITH_USER', (id) => {
        socketConnections.push(id);
        const currentUser = users[socket.id];
        socket.broadcast.to(id).emit('OPERATOR_CONNECTED', { user: currentUser });
        const timestamp = new Date().getTime();
        socket.to(id).emit('RECEIVE_MESSAGE', { timestamp, text: 'Входит ' + currentUser.name });
    });

    socket.on('disconnect', (reason) => {
        const user = usersRepository.findBySocketId(user.socketId);
        user.isOnline = false;
        socket.to(ticketId).emit('SET_USER_OFFLINE', user);
    });
});

module.exports = { users, operators };
