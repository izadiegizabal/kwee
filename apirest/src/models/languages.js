module.exports = (sequelize, DateTypes) => {

    const Language = sequelize.define('languages', {

        language: {
            type: DateTypes.STRING(20),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Language should not be empty."
                }
            }
        }

    });

    return Language;
};
