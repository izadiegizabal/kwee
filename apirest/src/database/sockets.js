const socketIO = require('socket.io');
const {server} = require('./express');
const {disconnect, message, selected, connectClient, setUser} = require('../middlewares/sockets');

var io = socketIO(server);
io.sockets.on('connection', (client) => {
    console.log('Client connected');

    // Connect client
    connectClient(client);

    // Configure user
    setUser(client, io);

    // Messages
    message(client);

    // Disconnect
    disconnect(client);

    selected(client);

});

module.exports = io;
