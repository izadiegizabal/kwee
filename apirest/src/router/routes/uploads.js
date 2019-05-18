const {tokenId} = require('../../shared/functions');
const fs = require('fs');
const path = require('path');

module.exports = (app, db) => {

    app.get('/uploads/:type/:file', async (req, res, next) => {

        let type = req.params.type;
        let file = req.params.file;

        let pathImage = path.resolve(__dirname, '../../',`uploads/${ type }/${ file }`);
        if (fs.existsSync(pathImage)) {
            res.sendFile(pathImage);
        } else {
            let noImagePath = path.resolve(__dirname, '../../assets/file/no-image.jpg');
            res.sendFile(noImagePath);
        }
    });

    app.post('/uploads/files', (req, res, next) => {
        saveFile(req, res, next);
    });

    function saveFile(req, res, next) {

        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            var location = `uploads/files/user_${ id }`;
    
            // Create dir if not exists
            if (!fs.existsSync(location)) {
                fs.mkdirSync(location, {recursive: true});
            }
    
            // image takes from body which you uploaded
            const filedata = req.body.file;
    
            // to convert base64 format into random filename
            // const base64Data = filedata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            const base64Data = filedata.split(',');
            
            var filename = req.body.name;
            
    
            filename = filename + '.' + base64Data[0].split('/')[1].split(';')[0];
    
            // to declare some path to store your converted image
            const path = location + '/' + filename;
    
            fs.writeFile(path, base64Data[1], 'base64', (err) => {
                if (err) {
                    next({type: 'error', error: err});
                }
            });
            return path;
        } catch (err) {
            next({type: 'error', error: err});
        }
    
    }



};
