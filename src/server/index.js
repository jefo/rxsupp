const io = require('socket.io')(3000);

io.on('connect', () => {
    console.log('connected')
});

io.on('connection', function (socket) {

    console.log('id', socket.id);

    socket.on('SEND_MESSAGE', function (msg) {
        console.log('message: ' + JSON.stringify(msg));
        socket.emit('SEND_MESSAGE_SUCCESS', msg);
    });
});
