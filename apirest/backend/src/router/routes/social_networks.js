// =======================================
// ======== CRUD social_networks =========
// =======================================

module.exports = (app, db) => {

    // GET all social_networks
    app.get('/social_networks', (req, res) => {
        db.social_networks.findAll()
            .then(social_networks => {
                res.json({
                    ok: true,
                    social_networks
                });
            });
    });

    // GET one social_network by id
    app.get('/social_network/:id', (req, res) => {
        const id = req.params.id;
        db.social_networks.findOne({
                where: { id }
            })
            .then(social_network => {
                if (social_network) {
                    res.json({
                        ok: true,
                        social_network
                    });
                } else {
                    res.json({
                        ok: false,
                        error: 'Social network doesnt exists'
                    });
                }
            });
    });

    // POST single social_network
    app.post('/social_network', (req, res) => {
        const twitter = req.body.twitter;
        const instagram = req.body.instagram;
        const telegram = req.body.telegram;
        const linkedin = req.body.linkedin;
        db.social_networks.create({
                twitter,
                instagram,
                telegram,
                linkedin
            })
            .then(newSocialNetwork => {
                if (newSocialNetwork) {
                    res.json({
                        ok: true,
                        message: `Social network with id ${newSocialNetwork.id} has been created.`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
    });

    // PUT single social_network
    app.put('/social_network/:id', (req, res) => {
        const id = req.params.id;
        const updates = req.body;
        db.social_networks.update(updates, {
                where: { id }
            })
            .then(updatedSocial_network => {
                if (updatedSocial_network[0]) {
                    res.json({
                        ok: true,
                        id
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `This social_network doesnt exists`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
    });

    // DELETE single social_network
    app.delete('/social_network/:id', (req, res) => {
        const id = req.params.id;
        db.social_networks.destroy({
                where: { id: id }
            })
            .then(deletedSocial_network => {
                if (deletedSocial_network) {
                    res.json({
                        ok: true,
                        message: `Social network with ID ${ id } has beend deleted`
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `Social network with ID ${ id } doesn't exists`
                    });
                }
            });
    });
}