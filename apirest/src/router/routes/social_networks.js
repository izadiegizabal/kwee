const {checkToken, checkAdmin} = require('../../middlewares/authentication');
const {tokenId, logger} = require('../../shared/functions');
const auth = require('../../shared/functions');
const {algorithm} = require('../../shared/algorithm');

// =======================================
// ======== CRUD social_networks =========
// =======================================

module.exports = (app, db) => {

    // GET all social_networks
    app.get('/social_networks', checkToken, async (req, res, next) => {
        try {
            await logger.saveLog('GET', 'social_networks', null, res);

            return res.status(200).json({
                ok: true,
                social_networks: await db.social_networks.findAll()
            });
        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET one social_network by id
    app.get('/social_network/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                social_network: await db.social_networks.findOne({where: {id}})
            });

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET social_networks by page limit to 10 social_networks/page
    app.get('/social_networks/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `social_networks/${page}`, null, res);

            let count = await db.social_networks.findAndCountAll();
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
                message: `${limit} social_networks of page ${page} of ${pages} pages`,
                data: await db.social_networks.findAll({
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

    // POST single social_network
    app.post('/social_network', async (req, res, next) => {
        const body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);

            let social_network = await db.social_networks.create({
                userId: id,
                twitter: body.twitter ? body.twitter : null,
                instagram: body.instagram ? body.instagram : null,
                telegram: body.telegram ? body.telegram : null,
                linkedin: body.linkedin ? body.linkedin : null
            });

            await algorithm.indexUpdate(id);

            res.status(201).json({
                ok: true,
                message: `Social_networks with id ${social_network.id} has been created.`
            });

        } catch (err) {
            next({type: 'error', error: err});
        }
    });

    // PUT single social_network
    app.put('/social_network', async (req, res, next) => {
        const updates = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            delete updates.userId;

            let social_network = await db.social_networks.update(updates, {
                where: {userId: id}
            });

            if (social_network) {
                await algorithm.indexUpdate(id);

                res.status(200).json({
                    ok: true,
                    message: `Social networks updated`,
                });
            } else {
                res.status(400).json({
                    ok: false,
                    message: `Social networks not updated`,
                });
            }
        } catch (err) {
            next({type: 'error', error: err.errors[0].message});
        }

    });

    // DELETE single social_network
    app.delete('/social_network/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        const id = req.params.id;

        try {

            res.json({
                ok: true,
                social_network: await db.social_networks.destroy({
                    where: {id: id}
                })
            });
            // Respuestas en json
            // social_network: 1 -> Deleted
            // social_network: 0 -> User don't exists
        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });
};
