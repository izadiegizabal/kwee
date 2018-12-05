const check = require('express-validator/check');

const checks = {

    // ============
    // Users
    // ============
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
        // to do !
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
    ],
    
    // ============
    //     Offers
    // ============
    Offer: [
        check.check('fk_offerer')
            .isInt().withMessage('Invalid ID value'),
        check.check('titles')
            .isEmpty().isAlpha().withMessage('Title should only contain letters.')
        //check.check('description')
    ]
}

const validationResult = ( errors ) => {
    if( errors.errors && errors.errors[0].message )
        return "_validations_1: " + errors.errors[0].message;
    else if( errors.message )
        return "_validations_2: " + errors.message;
    
}



module.exports = {
    checks,
    validationResult
}