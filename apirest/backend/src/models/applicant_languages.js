module.exports = (sequelize, DataTypes) => {

    const Applicant_Language = sequelize.define('applicant_languages', {

        level: {
            type: DataTypes.STRING,
            field: 'level'
        }

    }, {
        paranoid: true
    });
    return Applicant_Language;
};