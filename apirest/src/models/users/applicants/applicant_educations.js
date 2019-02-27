module.exports = (sequelize, DateTypes) => {

    const Applicant_Education = sequelize.define('applicant_educations', {

        description: {
            type: DateTypes.STRING(140),
            allowNull: false,
            field: 'description',
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Description should be filled."
                }
            }
        },

        dateStart: {
            type: DateTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Starting date should be filled."
                },
                isDate: {
                    "args": true,
                    "msg": "Starting date should be a date."
                },
                startDateAfterEndDate() {
                    const today = new Date();
                    if (this.dateStart >= this.dateEnd ) {
                        throw new Error('Start date must be before the end date.');
                    }
                    else if( this.dateStart >= today) {
                        throw new Error('Start date must be before today\'s date.');
                    }
                }
                
            }
        },

        dateEnd: {
            type: DateTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Starting date should be filled."
                },
                isDate: {
                    "args": true,
                    "msg": "Starting date should be a date."
                }
                
            }
        },

        institution: {
            type: DateTypes.STRING(50),
            allowNull: false,
            field: 'institution',
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Institution should be filled."
                }
            }
        },

    });

    return Applicant_Education;
};