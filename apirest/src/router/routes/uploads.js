const { tokenId, logger } = require('../../shared/functions');
const fileUpload = require('express-fileupload');


module.exports = (app, db) => {

    //default uptions
    app.use(fileUpload());

    app.put('/upload/:type', async(req, res, next) => {
        let type = req.params.type;

        try {

            let id = tokenId.getTokenId(req.get('token'));

            if (!isNaN(id)) {
                if (!req.files) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Not file selected'
                        }
                    });
                }

                // Validate type
                let validTypes = ['users'];
                if (validTypes.indexOf(type) < 0) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Valid types are: ' + validTypes.join(', ')
                        }
                    })
                }

                let file = req.files.file;
                let fileNameCut = file.name.split('.');
                let fileExt = fileNameCut[fileNameCut.length - 1];

                // Validate extension
                let validExt = ['png', 'jpg', 'gif', 'jpeg'];

                if (validExt.indexOf(fileExt) < 0) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Valid extension are ' + validExt.join(', '),
                            ext: fileExt
                        }
                    })
                }

                // Change file name
                let fileName = `user${ id }-${ new Date().getMilliseconds() }.${ fileExt }`;


                file.mv(`uploads/${ type }/${ fileName }`, (err) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    saveUserImg(id, res, fileName);

                });
            } else {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Invalid user'
                    }
                });
            }
        } catch (err) {
            next({ type: 'error', error: err });
        }

    });

    async function saveUserImg(id, res, fileName) {

        let updated = await db.users.update({ img: fileName }, {
            where: { id }
        });

        if (updated > 0) {
            res.json({
                ok: true,
                message: 'User img uploaded'
            });
        } else {
            return res.status(400).json({
                ok: false,
                message: "No updates were done."
            })
        }

    }

}