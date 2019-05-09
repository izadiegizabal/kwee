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

    // GET messages by page limit to 10 messages/page
    app.get('/messages/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `messages/${page}`, null, res);

            let count = await db.messages.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist ${page} pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${limit} messages of page ${page} of ${pages} pages`,
                data: await db.messages.findAll({
                    limit,
                    offset,
                    $sort: {id: 1}
                }),
                total: count.count
            });
        } catch (err) {
            next({type: 'error', error: err});
        }
    });

    // GET all messages by token id
    app.get("/messages", async ( req, res, next ) => {
        // getAllUserMessages( req, res, next );
        getMessageFromMongo( req, res, next );
    });
    
    app.get("/messages/:fk_receiver([0-9]+)", async ( req, res, next ) => {
        // getAllUserMessages( req, res, next );
        getMessagesBeetweenUsers( req, res, next );
    });

    // POST single message
    app.post("/message", checkToken, async (req, res, next) => {
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

    async function getMessageFromMongo( req, res, next ) {
        let id = tokenId.getTokenId(req.get('token'), res);

        Message.find({ 
            $or: [{ 
                'senderId': id 
                }, { 
                'receiverId': id 
                } 
            ]}, function(err, messages) {
                var usersNames = [];
                var users = [];
            
                messages.forEach(function(message) {
                    if ( !usersNames.includes( message.senderName ) && message.senderId != id ) {
                        usersNames.push( message.senderName );
                        users.push( { id: message.senderId, name: message.senderName } );
                    }
                    if ( !usersNames.includes( message.receiverName ) && message.receiverId != id ) {
                        usersNames.push( message.receiverName );
                        users.push( { id: message.receiverId, name: message.receiverName } );
                    }
                });


                return res.json({
                    ok: true,
                    message: 'Listing messages',
                    data: users,
                    total: users.length
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
