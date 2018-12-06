module.exports = (sequelize, DataTypes) => {

    const Applicant_Language = sequelize.define('applicant_languages', {

        level: {
            type: DataTypes.STRING(20),
            field: 'level'
        }

    });

    return Applicant_Language;
};