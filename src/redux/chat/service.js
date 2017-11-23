import { serviceFactory } from './redux';

export default (url) => {
    return new Promise(resolve => {
        const socket = io(url);
        socket.on('connect', () => {
            resolve(serviceFactory(socket));
        });
    });
}
