module.exports = (sequelize, DateTypes) => {

    const Offer = sequelize.define('offers', {

        fk_offerer: {
            type: DateTypes.INTEGER,
            allowNull: false,
            unique: {
                args: true,
                message: 'This social network has user.'
            }
        },

        title: {
            type: DateTypes.STRING,
            field: 'title',
            allowNull: false,
            unique: true,
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

        location: {
            type: DateTypes.STRING,
            field: 'location',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        salary: {
            type: DateTypes.INTEGER,
            field: 'salary',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        paranoid: true
    });
    return Offer;
};