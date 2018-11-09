module.exports = (app, db) => {

    // GET all owners
    app.get('/offers', (req, res) => {
        db.offers.findAll()
            .then(offers => {
                res.json(offers);
            });
    });
}