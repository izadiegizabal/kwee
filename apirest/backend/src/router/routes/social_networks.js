// =======================================
// ======== CRUD social_networks =========
// =======================================

module.exports = (app, db) => {

    // GET all social_networks
    app.get('/social_networks', async(req, res, next) => {
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
    app.get('/social_network/:id([0-9]+)', async(req, res, next) => {
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
        const userId = req.body.user;
        const twitter = req.body.twitter;
        const instagram = req.body.instagram;
        const telegram = req.body.telegram;
        const linkedin = req.body.linkedin;

        try {
            let social_network = await db.social_networks.create({
                userId,
                twitter,
                instagram,
                telegram,
                linkedin
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
    app.put('/social_network/:id', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                social_network: await db.social_networks.update(updates, {
                    where: { id }
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
    app.delete('/social_network/:id', async(req, res, next) => {
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