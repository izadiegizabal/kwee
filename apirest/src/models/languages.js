module.exports = (sequelize, DateTypes) => {

    const Language = sequelize.define('languages', {

        fk_applicant: {
            type: DateTypes.INTEGER,
            allowNull: false,
        },

        name: {
            type: DateTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Language should not be empty."
                } 
            }
        },

        level: {
            type: DateTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    });

    return Language;
};