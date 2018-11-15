module.exports = (sequelize, DateTypes) => {

    const Comment = sequelize.define('comments', {

        fk_rating_applicant: {
            type: DateTypes.INTEGER,
            allowNull: false,
        },

        fk_rating_offerer: {
            type: DateTypes.INTEGER,
            allowNull: false,
        },

        description: {
            type: DateTypes.TEXT,
            field: 'description',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        status: {
            type: DateTypes.ENUM,
            field: 'status',
            values: ['active', 'pending', 'deleted'],
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        deleted_reason: {
            type: DateTypes.STRING(50),
            field: 'deleted_reason',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

    }, {
        paranoid: true
    });
    return Comment;
};