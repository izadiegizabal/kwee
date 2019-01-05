const fs = require('fs');
const path = require('path');

module.exports = (app, db) => {

    app.get('/image/:type/:img', async(req, res, next) => {

        let type = req.params.type;
        let img = req.params.img;

        let pathImage = path.resolve(__dirname, `../../../uploads/${ type }/${ img }`);

        if (fs.existsSync(pathImage)) {
            res.sendFile(pathImage);
        } else {
            let noImagePath = path.resolve(__dirname, '../../assets/img/no-image.jpg');
            res.sendFile(noImagePath);
        }

        // User img from social network 
        // From frontend with PIPE

    });

}