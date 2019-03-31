const colors = require('../tools/colors');

module.exports = function errorHandler(error, req, res, next) {
    console.log(colors.redBright, 'ERROR: ' + colors.reset, error.error);
    return res.status(error.status || 400).json({ok: 'false', message: error.error});
};
