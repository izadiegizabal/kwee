module.exports = (sequelize, DateTypes) => {

    const Applicant_Education = sequelize.define('applicant_educations', {

        fk_applicant: {
            type: DateTypes.INTEGER,
            field: "fk_applicant",
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: "fk_applicant is not a valid number."
                },
                notEmpty: {
                    args: true,
                    msg: "fk_applicant should not be empty."
                }
            }
        },

        fk_education: {
            type: DateTypes.INTEGER,
            primaryKey: true,
            field: "fk_education",
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: "fk_education is not a valid number."
                },
                notEmpty: {
                    args: true,
                    msg: "fk_education should not be empty."
                }
            }
        },

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

        date_start: {
            type: DateTypes.DATE,
            allowNull: false,
            field: 'date_start',
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
                    if (this.date_start >= this.date_end ) {
                        throw new Error('Start date must be before the end date.');
                    }
                    else if( this.date_start >= today) {
                        throw new Error('Start date must be before today\'s date.');
                    }
                }
                
            }
        },

        date_end: {
            type: DateTypes.DATE,
            allowNull: false,
            field: 'date_end',
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