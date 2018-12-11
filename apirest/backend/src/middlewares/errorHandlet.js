const colors = require('../tools/colors');

module.exports = function errorHandler(error, req, res, next) {
    console.log(colors.redBright, 'ERROR: ' + colors.reset, error.error);
    // let message = `
    //     ${ error.error.name? error.error.name:'' } 
    //     at ${ error.error.fields? error.error.fields:'' }
    //     with value: ${ error.error.value? error.error.value:'' }
    // `
    // ;
    // console.log("==============");
    // console.log(error);
    // console.log("==============");
    // message += error.error;
    res.status(error.status || 400).json({ ok: 'false', error: error.error });
};