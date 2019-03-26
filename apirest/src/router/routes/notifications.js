const { logger, tokenId } = require('../../shared/functions');

// =======================================
// ======== CRUD notifications =========
// =======================================

module.exports = (app, db) => {

    // GET all notifications
    app.get('/notifications', async(req, res, next) => {
        try {
            let id = tokenId.getTokenId(req.get('token'));
            await logger.saveLog('GET', 'notifications', null, res);

            let notifications = await db.notifications.findAll({ where: { to: id } });

            if ( notifications ) {
                return res.status(200).json({
                    ok: true,
                    message: `Listing all notifications of user id: ${ id }`,
                    data: notifications
                });
            } else {
                next({ type: 'error', error: 'You do not have notifications' });
            }
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET notifications by page limit to 10 notifications/page
    app.get('/notifications/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            let id = tokenId.getTokenId(req.get('token'));
            await logger.saveLog('GET', `notifications/${ page }`, null, res);

            let count = await db.notifications.findAndCountAll({where: { to: id }});
            if ( count ) {
                let pages = Math.ceil(count.count / limit);
                offset = limit * (page - 1);

                if (page > pages) {
                    return res.status(200).json({
                        ok: true,
                        message: `It doesn't exist ${ page } pages`
                    })
                }

                return res.status(200).json({
                    ok: true,
                    message: `${ limit } notifications of page ${ page } of ${ pages } pages`,
                    data: await db.notifications.findAll({
                        limit,
                        offset,
                        $sort: { id: 1 }
                    }),
                    total: count.count
                });
            } else {
                next({ type: 'error', error: 'You do not have notifications' });
            }
        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // GET one notification by id
    app.get('/notification/:id([0-9]+)', async(req, res, next) => {
        const idNotification = req.params.id;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let notification = await db.notifications.findOne({ where: { id: idNotification } })
            if ( notification ) {
                if ( notification.to === id ) {
                    return res.status(200).json({
                        ok: true,
                        message: `Showing notification ${ idNotification }`,
                        data: notification
                    });
                } else {
                    next({ type: 'error', error: 'You may not watch applications of another user' });
                }
            } else {
                next({ type: 'error', error: 'This notification does not exists' });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // PUT single notification
    app.put('/notification/:id([0-9]+)/read', async(req, res, next) => {
        const idNotification = req.params.id;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let notification = await db.notifications.findOne({ where: { id: idNotification } });
            if ( notification ){
                if ( notification.to === id ) {
                    await db.notifications.update({ read: true }, { where: { id: idNotification } });
                    return res.status(200).json({
                        ok: true,
                        message: `Nofitication ${ idNofitication } is now read`
                    });
                } else {
                    next({ type: 'error', error: 'You may not read applications of other users' });
                }
            } else {
                next({ type: 'error', error: 'This notification does not exists' });
            }
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }

    });

    // DELETE single notification
    app.delete('/notification/:id([0-9]+)', async(req, res, next) => {
        const idNotification = req.params.id;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let notification = db.notifications.findOne({ where: { id: idNotification }})
            if ( notification ) {
                if ( notification.to === id ) {
                    await db.notifications.destroy({ where: { id: idNotification } });
                    return res.json({
                        ok: true,
                        message: 'Notification deleted'
                    });
                } else {
                    next({ type: 'error', error: 'You may not delete the application of another user' });
                }
            } else {
                next({ type: 'error', error: 'This notification does not exists' });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}