// ============================
// ===== CRUD user_offer ======
// ============================

module.exports = (app, db) => {

    // GET all users_offers
    app.get('/users_offers', (req, res) => {
        db.users_offers.findAll()
            .then(users_offers => {
                res.json({
                    ok: true,
                    users_offers
                });
            });
    });

    // GET one user_offer by id
    app.get('/user_offer/:id', (req, res) => {
        const id = req.params.id;
        db.users_offers.findOne({
                where: { id }
            })
            .then(user_offer => {
                if (user_offer) {
                    res.json({
                        ok: true,
                        user_offer
                    });
                } else {
                    res.json({
                        ok: false,
                        error: 'User_offer doesnt exists'
                    });
                }
            });
    });

    // POST single user_offer
    app.post('/user_offer', (req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;
        //TODO
        let user = db.users.findOne({
            where: { id }
        })
        user.setOffers(offer);
    });

    // PUT single user_offer
    app.put('/user_offer/:id', (req, res) => {
        const id = req.params.id;
        const updates = req.body;
        db.users_offers.update(updates, {
                where: { id }
            })
            .then(updatedUser => {
                if (updatedUser[0]) {
                    res.json({
                        ok: true,
                        id
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `This user_offer doesnt exists`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
    });

    // DELETE single user_offer
    app.delete('/user_offer/:id', (req, res) => {
        const id = req.params.id;
        db.users_offers.destroy({
                where: { id: id }
            })
            .then(deletedUser => {
                if (deletedUser) {
                    res.json({
                        ok: true,
                        message: `User_offer with ID ${ id } has beend deleted`
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `User_offer with ID ${ id } doesn't exists`
                    });
                }
            });
    });
}