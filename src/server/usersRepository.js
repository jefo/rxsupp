const users = [];

module.exports = {

    addOrUpdate(user) {
        const userIndex = users.findIndex(item => item.socketId === user.socketId);
        if (userIndex > -1) {
            Object.assign(users[userIndex], user);
        } else {
            users.push(user);
        }
    },

    remove(socketId) {
        users = users.filter(user => user.socketId === socketId);
    },

    findByLogin(login) {
        return users.filter(user => user.login === login);
    },

    findBySocketId(socketId) {
        return users.filter(user => user.socketId === socketId);
    }
}
