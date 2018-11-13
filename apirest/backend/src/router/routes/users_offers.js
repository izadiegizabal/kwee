// ============================
// ===== CRUD user_offer ======
// ============================

module.exports = (app, db) => {
    // GET all users_offers
    app.get("/users_offers", (req, res) => {
        db.users_offers.findAll().then(users_offers => {
            res.json({
                ok: true,
                users_offers
            });
        });
    });

    // GET one user_offer by id
    app.get("/user_offer/:userId/:offerId", async(req, res) => {
        const userId = +req.params.userId;
        const offerId = +req.params.offerId;
        try {
            console.log(userId);
            let user_offer = await db.users.findOne({
                include: [{
                    model: db.offers,
                    where: { id: offerId }
                }],
                where: { id: userId }
            });

            res.json({
                ok: true,
                user_offer
            });
        } catch (err) {
            console.log(err);
            res.json({
                ok: false,
                error: "User_offer doesnt exists"
            });
        }
    });

    // POST single user_offer
    app.post("/user_offer", async(req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;

        let user = await db.users.findOne({
            where: { id }
        });

        // await user.setOffers(offer);
        let user_offer = await user.setOffers(offer);
        // await db.sequelize.query({ query: 'UPDATE users_ofers SET status=\'asdfasdf\' WHERE userId = ? AND offerId = ?', values: [id, offer] });
        res.json(user_offer);
    });

    // PUT single user_offer
    app.put("/user_offer", async(req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;
        //TODO
        let user = await db.users.findOne({
            where: { id }
        });

        // await user.setOffers(offer);
        let user_offer = await user.setOffers(offer);
        await db.sequelize.query({ query: 'UPDATE users_offers SET status=\'asdfasdf\' WHERE userId = ? AND offerId = ?', values: [id, offer] });

    });

    // DELETE single user_offer
    app.delete("/user_offer/:id", (req, res) => {
        const id = req.params.id;
        db.users_offers
            .destroy({
                where: { id: id }
            })
            .then(deletedUser => {
                if (deletedUser) {
                    res.json({
                        ok: true,
                        message: `User_offer with ID ${id} has beend deleted`
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `User_offer with ID ${id} doesn't exists`
                    });
                }
            });
    });
};