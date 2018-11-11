// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    // GET all offers
    app.get('/offers', (req, res) => {
        db.offers.findAll()
            .then(offers => {
                res.json({
                    ok: true,
                    offers
                });
            });
    });

    // GET one offer by id
    app.get('/offer/:id', (req, res) => {
        const id = req.params.id;
        db.offers.findOne({
                where: { id }
            })
            .then(offer => {
                if (offer) {
                    res.json({
                        ok: true,
                        offer
                    });
                } else {
                    res.json({
                        ok: false,
                        error: 'Offer doesnt exists'
                    });
                }
            });
    });

    // POST single offer
    app.post('/offer', (req, res) => {
        const title = req.body.title;
        const description = req.body.description;
        const date_start = req.body.date_start;
        const date_end = req.body.date_end;
        const location = req.body.location;
        const salary = req.body.salary;
        db.offers.create({
                title,
                description,
                date_start,
                date_end,
                location,
                salary
            })
            .then(newOffer => {
                if (newOffer) {
                    res.json({
                        ok: true,
                        message: `Offer with id ${newOffer.id} has been created.`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
    });

    // PUT single offer
    app.put('/offer/:id', (req, res) => {
        const id = req.params.id;
        const updates = req.body;
        db.offers.update(updates, {
                where: { id }
            })
            .then(updatedOffer => {
                if (updatedOffer[0]) {
                    res.json({
                        ok: true,
                        id
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `This offer doesnt exists`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
    });

    // DELETE single offer
    app.delete('/offer/:id', (req, res) => {
        const id = req.params.id;
        db.offers.destroy({
                where: { id: id }
            })
            .then(deletedOffer => {
                if (deletedOffer) {
                    res.json({
                        ok: true,
                        message: `Offer with ID ${ id } has beend deleted`
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `Offer with ID ${ id } doesn't exists`
                    });
                }
            });
    });
}