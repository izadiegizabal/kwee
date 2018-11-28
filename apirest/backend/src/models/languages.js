module.exports = (sequelize, DateTypes) => {

    const Language = sequelize.define('languages', {

        language: {
            type: DateTypes.STRING(20),
            field: 'language',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }
    }, {
        paranoid: true
    });
    return Language;
};