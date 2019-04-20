module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define('messages', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

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
            field: 'message',
            allowNull: false
        }
    }, {
        paranoid: true
    });
    return Message;
};