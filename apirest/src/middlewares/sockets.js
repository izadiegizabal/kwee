const UsersList = require('../classes/users-list');
const User = require('../classes/users');

const io = require('../database/sockets');

const usersConnected = new UsersList();

const connectClient = (client) => {

    const user = new User(client.id);
    usersConnected.add(user);

};

const disconnect = (client) => {
    client.on('disconnect', () => {
        console.log('Cliente disconnected');
        usersConnected.deleteUser(client.id);
    });
};

const message = (client) => {
    client.on('message', (payload) => {
        console.log('Mensaje recibido:', payload);

        io.emit('new-msg', payload);

    });
};

const selected = (client) => {
    console.log('enviando socket "selected" al frontend');
    client.on('selected', (payload) => {
        io.emit('selected', client);
    });
};

const setUser = (client, io) => {
    client.on('set-user', (payload, callback) => {

        usersConnected.updateEmail(client.id, payload.email);

        io.emit('active-users', usersConnected.getList());

        callback({
            ok: true,
            mensaje: `User ${payload.email}, configurado`
        });
    });
};

module.exports = {
    disconnect,
    message,
    selected,
    connectClient,
    setUser,
    usersConnected
};
