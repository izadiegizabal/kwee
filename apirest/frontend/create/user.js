const User = require('../../models/user')

module.exports = {
    newUser: function(user) {
        User.sync({
                force: true
            })
            .then(function() {
                return User.create(user)
            })
            .catch(function(err) {
                console.log(err);
            });
    }
};