const { tokenId, logger } = require('../../shared/functions');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');


module.exports = (app, db) => {

    //default uptions
    app.use(fileUpload());

    app.put('/upload/:type', async(req, res, next) => {
        

    });





}