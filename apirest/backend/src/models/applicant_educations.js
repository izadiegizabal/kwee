module.exports = (sequelize, DateTypes) => {

    const Applicant_Education = sequelize.define('applicant_educations', {

        description: {
            type: DateTypes.TEXT,
            field: 'description'
        },

        date_start: {
            type: DateTypes.DATE,
            field: 'date_start'
        },

        date_end: {
            type: DateTypes.DATE,
            field: 'date_end'
        },

        institution: {
            type: DateTypes.STRING,
            field: 'institution'
        },

    });

    return Applicant_Education;
};