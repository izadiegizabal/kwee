module.exports = (sequelize, DateTypes) => {

    const Experience = sequelize.define('experiences', {

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

        // company (FK DE MOMENTO NO) --> string
    }, {
        paranoid: true
    });
    return Experience;
};