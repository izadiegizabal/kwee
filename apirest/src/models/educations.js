module.exports = (sequelize, DateTypes) => {

    const Education = sequelize.define('educations', {

        fk_applicant: {
            type: DateTypes.INTEGER,
            allowNull: false,
        },

        title: {
            type: DateTypes.STRING(50),
            field: 'title',
            allowNull: false,
            validate: {
                notEmpty: true,
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
                    msg: "Title should be letters only (accented letters admitted)."
                }
            }
        },

        description: {
            type: DateTypes.TEXT,
            field: 'description',
        },

        dateStart: {
            type: DateTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        dateEnd: {
            type: DateTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

    });

    return Education;
};