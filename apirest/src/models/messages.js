module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define('messages', {

        fk_sender: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fk_receiver: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT,
            field: 'message'
        },

        status: {
            type: DataTypes.ENUM,
            field: 'status',
            values: ['active', 'pending', 'deleted'],
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        paranoid: true
    });
    return Message;
};