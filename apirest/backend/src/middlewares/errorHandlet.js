const colors = require('../tools/colors');

module.exports = function errorHandler(error, req, res, next) {
    console.log(colors.redBright);
    console.log('ERROR: ' + colors.reset);
    console.log(error.error);
    res.status(error.status || 400).json({ error: error.error });
};