// ============================
// ===== CRUD user_offer ======
// ============================

module.exports = (app, db) => {
    // GET all users_offers
    app.get("/users_offers", async(req, res) => {
        try {
            let user_offer = await db.users_offers.findAll();

            if (user_offer.length != 0) {
                res.status(200).json({
                    ok: true,
                    users_offers
                });
            } else {
                res.status(200).json({
                    ok: true,
                    message: "No data"
                });
            }
        } catch (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
    });

    // GET one user_offer by id
    app.get("/user_offer/:userId/:offerId", async(req, res) => {
        const userId = +req.params.userId;
        const offerId = +req.params.offerId;
        try {
            let user_offer = await db.users.findOne({
                include: [{
                    model: db.offers,
                    where: { id: offerId }
                }],
                where: { id: userId }
            });

            if (user_offer) {
                res.status(200).json({
                    ok: true,
                    user_offer
                });
            } else {
                res.status(200).json({
                    ok: true,
                    error: "User_offer doesnt exists"
                });
            }
        } catch (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
    });

    // POST single user_offer
    app.post("/user_offer", async(req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;
        try {
            let user = await db.users.findOne({
                where: { id }
            });

            let user_offer = await user.setOffers(offer);
            res.status(200).json({
                ok: true,
                user_offer
            });
        } catch (err) {
            res.status(400).json({
                ok: false,
                error: 'Can\'t create'
            });
        }
    });

    // PUT single user_offer
    app.put("/user_offer", async(req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;
        const status = req.body.status;
        try {
            let user = await db.users.findOne({
                where: { id }
            });

            let user_offer = await user.setOffers(offer);
            await db.sequelize.query({ query: `UPDATE users_offers SET status=\'${ status }\' WHERE userId = ? AND offerId = ?`, values: [id, offer] });
            res.json(user_offer);
        } catch (err) {
            res.json(err);
        }
    });

    // DELETE single user_offer
    app.delete("/user_offer", async(req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;

        let user = await db.users.findOne({
            where: { id }
        });

        let user_offer = await user.destroy(offer);
        res.json(user_offer);
    });
};