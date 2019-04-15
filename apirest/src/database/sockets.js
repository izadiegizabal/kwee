const env = require('../tools/constants');
const socketIO = require('socket.io');
const {server} = require('./express');
const {disconnect, message, selected, connectClient, setUser, rating} = require('../middlewares/sockets');

var io = socketIO(server);

io.origins((origin, callback) => {
    const isOVH = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?kwee\.ovh(\/.*)?$/.test(origin);
    const isH203 = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?h203\.eps\.ua\.es(\/.*)?$/.test(origin);
    console.log(isOVH, isH203, origin !== 'http://localhost:4200', origin !== env.URL);
    if (origin !== 'http://localhost:4200' && !isOVH && !isH203 && origin !== env.URL) {
       return callback('origin not allowed', false);
    }
    callback(null, true);
});

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
    
    rating(client);
});

module.exports = io;
