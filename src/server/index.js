const io = require('socket.io')(3000);

io.on('connect', () => {
    console.log('connected')
});

const operators = ['jefo.operator@gmail.com'];

io.on('connection', function (socket) {

    console.log('id', socket.id);

    socket.on('SEND_MESSAGE', function (msg) {
        console.log('message: ' + JSON.stringify(msg));
        socket.emit('SEND_MESSAGE_SUCCESS', msg);
    });

    socket.on('USER_LOGIN', (email) => {
        let role = operators.some(item => item === email) ? 'operator' : 'user';
        socket.emit('USER_LOGIN_SUCCESS', { email, role });
    });
});
