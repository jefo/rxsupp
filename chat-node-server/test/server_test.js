import assert from 'assert';
import cookie from 'cookie';
import io from 'socket.io-client';

import startServer from '../src/server';
import {
    createChat,
    USER_SIGN_IN,
    MESSAGE_SEND,
    CHAT_READY,
    CHAT_INIT,
    USER_ADD,
    USER_UPDATE,
    USER_SET_ROOM,
    MESSAGE_ADD,
    Message
} from '../../rxsupp.core/src/chat';

describe('server', function () {

    this.timeout(5000);

    let server
    let client;

    beforeEach((done) => {
        client = io.connect('http://localhost:3001', {
            transports: ['websocket'],
            'force new connection': true
        });
        server = startServer(3001);
        done();
    });

    afterEach((done) => {
        client.disconnect();
        done();
    });

    after(() => {
        server.close();
    });

    it('should set client id cookie on handshake', (done) => {
        server.on('connection', socket => {
            let cookies = cookie.parse(socket.handshake.headers.cookie);
            assert.ok(cookies.clientId);
            done();
        });
    });

    it('should handle MESSAGE_ADD event', (done) => {
        server.on('connection', socket => {
            let sentMessage = new Message('1');
            socket.on('MESSAGE_ADD', (message) => {
                console.log('MESSAGE', message);
                done();
            });
            client.emit('MESSAGE_ADD', sentMessage);
        });
    });
});
