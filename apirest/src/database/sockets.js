const env = require('../tools/constants');
const socketIO = require('socket.io');
const { server } = require('./express');
const { disconnect, message, selected, connectClient, setUser } = require('../middlewares/sockets');

var io = socketIO(server);

io.origins((origin, callback) => {
    const isOVH = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?kwee\.ovh(\/.*)?$/.test(origin);
    console.log(!isOVH, origin !== 'http://localhost:4200',  origin !== env.URL);
    if (origin !== 'http://localhost:4200' && !isOVH && origin !== env.URL) {
       console.log('No entiendo nada');
       return callback('origin not allowed', false);
    }
    callback(null, true);
});

io.sockets.on('connection', (client) => {
    console.log('Client connected');

    // Connect client
    connectClient( client );

    // Configure user
    setUser( client, io );

    // Messages
    message( client );

    // Disconnect
    disconnect( client );

    selected( client );
    
});

module.exports = io;
