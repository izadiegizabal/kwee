const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/kwee', (err, res) => {

    if (err) throw err;

    console.log("Base de datos en Mongo online");

});