const { checkToken } = require('../../middlewares/authentication');
const { logger, tokenId } = require('../../shared/functions');
const { Op } = require('../../database/op');
const Message = require('../../models/messages');
const moment = require('moment');

// ============================
// ===== CRUD message ======
// ============================

module.exports = (app, db) => {
    // GET one message by two id's
    app.get("/message/:fk_sender([0-9]+)/:fk_receiver([0-9]+)", checkToken, async (req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                message: await db.messages.findOne({
                    where: {fk_sender: params.fk_sender, fk_receiver: params.fk_receiver}
                })
            });

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET all messages by token id
    app.get("/messages", async ( req, res, next ) => {
        // getAllUserMessages( req, res, next );
        getMessageFromMongo( req, res, next );
    });
    
    // GET all messages unread of token id
    app.get("/messages/unread", async ( req, res, next ) => {
        // getAllUserMessages( req, res, next );
        getMessagesUnread( req, res, next );
    });
    
    app.get("/messages/:fk_receiver([0-9]+)", async ( req, res, next ) => {
        // getAllUserMessages( req, res, next );
        getMessagesBeetweenUsers( req, res, next );
    });

    // POST single message
    app.post("/message", async (req, res, next) => {
        // postMessage( req, res, next );
        createMessage( req, res, next );
    });

    // PUT single message
    app.put("/message", checkToken, async (req, res, next) => {
        const body = req.body;

        try {
            let sender = await db.users.findOne({
                where: {userId: body.fk_sender}
            });

            if (sender) {
                await db.sequelize.query({
                    query: `UPDATE messages SET message = ? WHERE fk_sender = ? AND fk_receiver = ?`,
                    values: [body.message, body.fk_sender, fk_receiver]
                });
                res.status(200).json({
                    ok: true,
                    message: 'Updated'
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    error: "Message doesn't exist"
                });
            }

        } catch (err) {
            next({type: 'error', error: err.errors[0].message});
        }
    });

    // DELETE single message
    app.delete("/message", checkToken, async (req, res, next) => {
        const body = req.body;

        try {
            let sender = await db.users.findOne({
                where: {userId: body.fk_sender}
            });

            if (sender) {
                await sender.removeMessages(body.fk_receiver);

                res.status(201).json({
                    ok: true,
                    message: "Deleted"
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    error: "This message doesn't exist"
                });
            }
        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }

    });

    async function createMessage( req, res, next ) {
        const body = req.body;
        const fk_receiver = body.receiverId;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            let sender = await db.users.findOne({
                where: { id }
            });
            let receiver = await db.users.findOne({
                where: { id: fk_receiver }
            });

            if ( receiver ) {
                    let toMessage = {
                        senderId: sender.id,
                        senderName: sender.name,
                        receiverId: receiver.id,
                        receiverName: receiver.name,
                        message: body.message, 
                        read: false,
                        date: moment().format('YYYY/MM/DD'),
                        hour: moment().format('HH:mm:ss')
                    };
                    
                    let message = new Message(toMessage);
                    
                    return await new Promise(resolve => {
                        message.save((err, messageDB) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    error: "Message not create"
                                });
                            }
                            resolve(messageDB._id);
                            return res.json({
                                ok: true,
                                message: 'Created conversation'
                            });
                        });
                    });
                // }
            } else {
                return res.status(200).json({
                    ok: true,
                    message: "This user not exists"
                });
            }
        } catch (err) {
            next({type: 'error', error: err.message});
        }
    }

    async function getAllUserMessages( req, res, next ) {
        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            let users = await db.users.findAll({
                include: [{
                    model: db.users,
                    as: 'sender',
                }]
            });

            let messages = users.filter( message => message.sender.length > 0 );

            if ( messages ) {   
                return res.status(200).json({
                    ok: true,
                    message: 'Showing all messages of this user',
                    data: messages
                });
            } else {
                return next({type: 'error', error: 'This user does not have messages'});
            }

        } catch (err) {
            next({type: 'error', error: err.message});
        }
    }

    async function postMessage( req, res, next ) {
        const body = req.body;
        const fk_receiver = body.fk_receiver;
        const message = body.message;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            let sender = await db.users.findOne({
                where: { id }
            });
            let receiver = await db.users.findOne({
                where: { id: fk_receiver }
            })

            if ( sender && receiver ) {

                await db.messages.create({
                    fk_sender: id,
                    fk_receiver,
                    message
                });

                return res.status(201).json({
                    ok: true,
                    message: 'Message created'
                });

            } else {
                return res.status(200).json({
                    ok: true,
                    message: "This user not exists"
                });
            }
        } catch (err) {
            next({type: 'error', error: err.message});
        }
    }

    async function getMessageFromMongo( req, res, next ) {
        let id = tokenId.getTokenId(req.get('token'), res);
        let usersMysql = await db.users.findAll();

        Message.find({ 
                    $or: [{ 
                        'senderId': id 
                        }, { 
                        'receiverId': id 
                        } 
                    ]})
                .sort({date: 'desc', hour: 'desc'})
                .exec( function(err, messages) {
                        // Different users with chat inicializated
                        var usersNames = [];
                        var users = [];

                        console.log('total: ', messages.length);
                        

                        messages.forEach( async (message, idx) => {
                            if ( !usersNames.includes( message.senderName ) && message.senderId != id ) {
                                let user = usersMysql.find(user => user.id === message.senderId);
                                
                                usersNames.push( message.senderName );
                                users.push({
                                    id: message.senderId, 
                                    name: message.senderName, 
                                    img: user.img,
                                    lastMessage: message
                                });
                            }
                            if ( !usersNames.includes( message.receiverName ) && message.receiverId != id ) {
                                let user = usersMysql.find(user => user.id === message.receiverId);
                                
                                usersNames.push( message.receiverName );
                                users.push({
                                    id: message.receiverId, 
                                    name: message.receiverName, 
                                    img: user.img,
                                    lastMessage: message
                                });
                            }
                        });

                        return res.json({
                            ok: true,
                            message: 'Listing messages',
                            data: users,
                            total: users.length // This is the total of different users with chat
                        });
                  });
    }

    async function getMessagesUnread( req, res, next ) {
        let id = tokenId.getTokenId(req.get('token'), res);
        Message.find({ read: false })
                .exec( ( err, messages ) => {
                    console.log('Number of messages unread: ', messages.length);
                    return res.json({
                        ok: true,
                        message: 'Number of messages unread',
                        total: messages.length
                    });
                });
    }
    
    async function getMessagesBeetweenUsers( req, res, next ) {
        const fk_receiver = req.params.fk_receiver;
        let id = tokenId.getTokenId(req.get('token'), res);

        Message.find({ 
            $or: [
                { $and: [{ 'senderId': id }, { 'receiverId': fk_receiver }] },
                { $and: [{ 'receiverId': id }, { 'senderId': fk_receiver }] }
            
            ]}, function(err, messages) {
                var messageMap = [];
            
                messages.forEach(function(message) {
                    messageMap.push(message);
                });

                return res.json({
                    ok: true,
                    message: 'Listing messages',
                    data: messageMap,
                    total: messageMap.length
                });
          });
    }
};
