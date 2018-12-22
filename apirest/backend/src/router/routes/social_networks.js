const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const auth = require('../../shared/functions');

// =======================================
// ======== CRUD social_networks =========
// =======================================

module.exports = (app, db) => {

    // GET all social_networks
    app.get('/social_networks', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                social_networks: await db.social_networks.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one social_network by id
    app.get('/social_network/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                social_network: await db.social_networks.findOne({ where: { id } })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single social_network
    app.post('/social_network', async(req, res, next) => {
        const body = req.body;

        try {
            let id = getTokenId.tokenId.getTokenId(req.get('token'));

            let social_network = await db.social_networks.create({
                userId: id,
                twitter: body.twitter ? body.twitter : null,
                instagram: body.instagram ? body.instagram : null,
                telegram: body.telegram ? body.telegram : null,
                linkedin: body.linkedin ? body.linkedin : null
            })

            res.status(201).json({
                ok: true,
                message: `Social_networks with id ${social_network.id} has been created.`
            });

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        };

    });

    // PUT single social_network
    app.put('/social_network', async(req, res, next) => {
        const updates = req.body;

        try {
            let id = getTokenId.tokenId.getTokenId(req.get('token'));
            res.status(200).json({
                ok: true,
                social_network: await db.social_networks.update(updates, {
                    where: { userId: id }
                })
            });
            // json
            // social_network: [1] -> Updated
            // social_network: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }

    });

    // DELETE single social_network
    app.delete('/social_network/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                social_network: await db.social_networks.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // social_network: 1 -> Deleted
            // social_network: 0 -> User don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}