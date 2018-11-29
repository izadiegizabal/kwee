module.exports = (sequelize, DateTypes) => {

    const Applicant_Education = sequelize.define('applicant_educations', {

        description: {
            type: DateTypes.TEXT,
            field: 'description',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        date_start: {
            type: DateTypes.DATE,
            field: 'date_start',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        //institution opcional

        date_end: {
            type: DateTypes.DATE,
            field: 'date_end',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    }, {
        paranoid: true
    });
    return Applicant_Education;
};