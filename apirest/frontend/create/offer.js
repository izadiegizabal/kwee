const Offer = require('../../models/offer')

module.exports = {
    newOffer: function(offer) {
        Offer.sync({
                force: true
            })
            .then(function() {
                return Offer.create(offer)
            })
            .catch(function(err) {
                console.log(err);
            });
    }
};