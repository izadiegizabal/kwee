const colors = require('../tools/colors');
const moment = require('moment');

module.exports = (req, res, next) => {
    console.log(`${colors.whiteBright}${moment().format('HH:mm:ss')} ${colors.gray}[${req.method}]${colors.reset}: ${colors.green}${req.url}`);
    next();
};
