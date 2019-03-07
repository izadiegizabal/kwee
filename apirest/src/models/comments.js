module.exports = (sequelize, DateTypes) => {

    const Comment = sequelize.define('comments', {

        fk_user: {
            type: DateTypes.INTEGER,
            allowNull: false
        },

        fk_rating_applicant: {
            type: DateTypes.INTEGER,
        },

        fk_rating_offerer: {
            type: DateTypes.INTEGER,
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
            values: ['pending', 'active', 'deleted'],
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        deletedReason: {
            type: DateTypes.STRING,
            field: 'deletedReason',
        },

    }, {
        paranoid: true
    });
    return Comment;
};