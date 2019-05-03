const UsersList = require('../classes/users-list');
const db = require('../database/sequelize');
const User = require('../classes/users');

const io = require('../database/sockets');

const usersConnected = new UsersList();

const connectClient = ( client ) => {

    const user = new User(client.id);
    usersConnected.add(user);

};

const disconnect = ( client ) => {
    client.on('disconnect', () => {
        console.log('Cliente disconnected');
        usersConnected.deleteUser(client.id);
    });
};

const message = ( client, io ) => {
    client.on('message', async ( payload ) => {
        console.log('Mensaje recibido:', payload);

        let user = await db.users.findOne({
            where: { id: payload.receiverId }
        });

        let users = usersConnected.getList();

        users.forEach( u => {
            if ( u.email == user.email ) {
                io.in( u.id ).emit('new-msg', payload);
            }
        });


    });
};

const selected = ( client, io ) => {
    client.on('selected', (payload) => {
        console.log('enviando socket "selected" al frontend');
        io.emit('selected', client);
    });
};

const rating = ( client, io ) => {
    client.on('rating', (payload) => {
        console.log('sending notification of need to rate after 1 month to frontend');
        io.emit('rating', client);
    });
};

const setUser = ( client, io ) => {
    client.on('set-user', ( payload, callback ) => {

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
    usersConnected,
    rating
};
