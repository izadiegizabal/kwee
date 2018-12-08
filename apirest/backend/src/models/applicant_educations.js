module.exports = (sequelize, DateTypes) => {

    const Applicant_Education = sequelize.define('applicant_educations', {

        fk_applicant: {
            type: DateTypes.INTEGER,
            field: "fk_applicant",
            //allowNull: false,
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
            field: "fk_education",
            //allowNull: false,
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
            type: DateTypes.TEXT,
            //allowNull: false,
            field: 'description'
        },

        date_start: {
            type: DateTypes.DATE,
            //allowNull: false,
            field: 'date_start'
        },

        date_end: {
            type: DateTypes.DATE,
            //allowNull: false,
            field: 'date_end'
        },

        institution: {
            type: DateTypes.STRING,
            //allowNull: false,
            field: 'institution'
        },

    });

    return Applicant_Education;
};