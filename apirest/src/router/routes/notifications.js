const {logger, tokenId} = require('../../shared/functions');

// =======================================
// ======== CRUD notifications =========
// =======================================

module.exports = (app, db) => {

    // GET all notifications by token user
    app.get('/notifications', async (req, res, next) => {
        getNotificationsOfTokenUser(req, res, next);
    });

    // PUT single notification
    app.put('/notification/:id([0-9]+)/read', async (req, res, next) => {
        updateNotification(req, res, next);
    });

    // // GET notifications by page limit to 10 notifications/page
    // app.get('/notifications/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
    //     let limit = Number(req.params.limit);
    //     let page = Number(req.params.page);

    //     try {
    //         let id = tokenId.getTokenId(req.get('token'), res);
    //         await logger.saveLog('GET', `notifications/${page}`, null, res);

    //         let count = await db.notifications.findAndCountAll({where: {to: id}});
    //         if (count) {
    //             let pages = Math.ceil(count.count / limit);
    //             offset = limit * (page - 1);

    //             if (page > pages) {
    //                 return res.status(200).json({
    //                     ok: true,
    //                     message: `It doesn't exist ${page} pages`
    //                 })
    //             }

    //             return res.status(200).json({
    //                 ok: true,
    //                 message: `${limit} notifications of page ${page} of ${pages} pages`,
    //                 data: await db.notifications.findAll({
    //                     limit,
    //                     offset,
    //                     $sort: {id: 1}
    //                 }),
    //                 total: count.count
    //             });
    //         } else {
    //             next({type: 'error', error: 'You do not have notifications'});
    //         }
    //     } catch (err) {
    //         next({type: 'error', error: err.message});
    //     }
    // });

    // // GET one notification by id
    // app.get('/notification/:id([0-9]+)', async (req, res, next) => {
    //     const idNotification = req.params.id;

    //     try {
    //         let id = tokenId.getTokenId(req.get('token'), res);
    //         let notification = await db.notifications.findOne({where: {id: idNotification}});
    //         if (notification) {
    //             if (notification.to === id) {
    //                 return res.status(200).json({
    //                     ok: true,
    //                     message: `Showing notification ${idNotification}`,
    //                     data: notification
    //                 });
    //             } else {
    //                 next({type: 'error', error: 'You may not watch applications of another user'});
    //             }
    //         } else {
    //             next({type: 'error', error: 'This notification does not exists'});
    //         }
    //     } catch (err) {
    //         next({type: 'error', error: 'Error getting data'});
    //     }
    // });

    // // DELETE single notification
    // app.delete('/notification/:id([0-9]+)', async (req, res, next) => {
    //     const idNotification = req.params.id;

    //     try {
    //         let id = tokenId.getTokenId(req.get('token'), res);
    //         let notification = db.notifications.findOne({where: {id: idNotification}});
    //         if (notification) {
    //             if (notification.to === id) {
    //                 await db.notifications.destroy({where: {id: idNotification}});
    //                 return res.json({
    //                     ok: true,
    //                     message: 'Notification deleted'
    //                 });
    //             } else {
    //                 next({type: 'error', error: 'You may not delete the application of another user'});
    //             }
    //         } else {
    //             next({type: 'error', error: 'This notification does not exists'});
    //         }
    //     } catch (err) {
    //         next({type: 'error', error: 'Error getting data'});
    //     }
    // });
    async function getNotificationsOfTokenUser( req, res, next ) {
        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            await logger.saveLog('GET', 'notifications', null, res, req.useragent, ip, id);

            let notificationsToShow = [];
            let attr = {};
            let where = {};
            where.to = id;
            attr.where = where;
            if ( req.query.limit && req.query.page ) {
                var limit = Number(req.query.limit);
                var page = Number(req.query.page)
                var offset = req.query.limit * (req.query.page - 1)
                attr.limit = limit;
                attr.offset = offset;
                attr.order = [['id', 'DESC']];
            }

            let count = await db.notifications.findAndCountAll({ where });
            let notifications = await db.notifications.findAll( attr );
            
            if (notifications) {
                let users = await db.users.findAll({
                    include: [{
                        model: db.applicants,
                        as: 'applicant'
                    }, {
                        model: db.offerers,
                        as: 'offerer'
                    }],
                    attributes: {
                        exclude: ["password"]
                    }
                });
                let offers = await db.offers.findAll();
                let ratings = await db.ratings.findAll();
                let applications = await db.applications.findAll();
                let numOfUnread = await db.notifications.findAndCountAll({ where: { to: id, read: 0 }});

                notifications.forEach( notification => {
                    let object = {};
                    // let to = users.find( to => to.id === notification.to );
                    let from = users.find( from => from.id === notification.from );
                    let offer, rating, application;
                    object.id = notification.id;
                    object.read = notification.read;
                    object.status = notification.status;
                    object.createdAt = notification.createdAt;
                    object.notification = notification.notification;
                    // object.to = to;
                    object.from = from;
                    switch ( notification.type ) {
                        case 'offers': 
                                    offer = offers.find( offer => offer.id === notification.idTable ); 
                                    object.offer = offer;
                                break;
                        case 'applicants': 
                                    rating = ratings.find( rating => rating.id === notification.idTable );
                                    object.rating = rating;
                                break;
                        case 'applications': 
                                    application = applications.find( appli => appli.id === notification.idTable );
                                    if ( application ) {
                                        offer = offers.find( offer => offer.id === application.fk_offer );
                                        object.offer = offer;
                                    }
                                break;
                    }
                    
                    notificationsToShow.push(object);
                });

                return res.status(200).json({
                    ok: true,
                    message: `Listing all notifications of user id: ${id}`,
                    data: notificationsToShow,
                    unread: numOfUnread.count,
                    total: count.count,
                    page,
                    limit,
                });
            } else {
                next({type: 'error', error: 'You do not have notifications'});
            }
        } catch (err) {
            return next({type: 'error', error: err.message});
        }
    }

    async function updateNotification( req, res, next ) {
        let idNotification = req.params.id;

        console.log('req.params: ', req.params);
        

        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            let notification = await db.notifications.findOne({where: {id: idNotification}});
            if (notification) {
                if (notification.to === id) {
                    await db.notifications.update({read: true}, {where: {id: idNotification}});
                    return res.status(200).json({
                        ok: true,
                        message: `Nofitication ${idNotification} is now read`
                    });
                } else {
                    next({type: 'error', error: 'You may not read applications of other users'});
                }
            } else {
                next({type: 'error', error: 'This notification does not exists'});
            }
        } catch (err) {
            next({type: 'error', error: err.message});
        }
    }
};
