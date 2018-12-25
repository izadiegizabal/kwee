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
                notEmpty: true
            }
        },

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

        date_end: {
            type: DateTypes.DATE,
            field: 'date_end',
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