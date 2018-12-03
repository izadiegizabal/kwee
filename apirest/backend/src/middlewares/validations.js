const check = require('express-validator/check');

const checks = {
    Register: [
        check.check('email')
            .isEmail().withMessage('Invalid email.'),
        check.check('password')
            .isLength({min: 8}).withMessage('Password too short.')
    ],
    UpdateUser: [
        check.check('email')
            .isEmail().withMessage('Invalid email.'),

        check.check('password').optional()
            .isLength({min: 8}).withMessage('Password too short.'),

        check.check('name').optional()
            .isAlpha().withMessage('Name should only contain letters.'),

        check.check('city').optional()
            .isAlpha().withMessage('Invalid city name.'),

        check.check('date_born').optional()
            .toDate().withMessage('Invalid date format.'),

        check.check('cif',['ES']).optional()
            .isIdentityCard().withMessage('Invalid CIF value.'),

        check.check('address').optional()
            .isAlphanumeric().withMessage('Invalid address value.')
            
        // work field

    ],
    ExtraStuff: [
        check.check('website').optional()
            .isURL().withMessage('Invalid website URL.'),
        
        check.check('about_us'),
        // ¿¿¿¿¿????????
        
        // check.check('company_size').optional()
        //      match??

        check.check('year').optional()
            .toDate().withMessage('Invalid year value.'),     
    ]  
}



module.exports = {
    checks
}