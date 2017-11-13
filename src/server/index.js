const io = require('socket.io')(3000);
let operator;

const operators = {
    1: 'jefo.operator@gmail.com'
};

const users = {};
const messages = {};
let counter = 0;
let ticketId;
// todo: operator chat version with incoming messages
// add list of client rooms with active messages
io.on('connection', (socket) => {

    const socketConnections = [];

    let currentUser = users[socket.id];
    if (!currentUser) {
        if (!ticketId) {
            ticketId = new Date().getTime().toString();
        }
        currentUser = users[socket.id] = {
            ticketId,
            id: socket.id,
            name: socket.id,
            isOnline: true,
            isAnon: true
        };
    }
    socket.join(ticketId);    
    console.log('ADD_USER:', currentUser.name);
    socket.emit('ADD_USER', { messages, users });

    socket.on('SEND_MESSAGE', (msg) => {
        messages[msg.id] = msg;
        console.log('ADD_MESSAGE:', msg.text);
        socket.broadcast.to(ticketId).emit('ADD_MESSAGE', msg);
    });

    socket.on('CONNECT_WITH_USER', (id) => {
        socketConnections.push(id);
        const currentUser = users[socket.id];
        socket.broadcast.to(id).emit('OPERATOR_CONNECTED', { user: currentUser });
        const timestamp = new Date().getTime();
        socket.to(id).emit('RECEIVE_MESSAGE', { timestamp, text: 'Входит ' + currentUser.name });
    });

    socket.on('disconnect', (reason) => {
        const user = users[socket.id];
        user.isOnline = false;
        socket.to(ticketId).emit('SET_USER_OFFLINE', { user });
        console.log('SET_USER_OFFLINE', user.id);
    });
});

module.exports = { users, operators };
