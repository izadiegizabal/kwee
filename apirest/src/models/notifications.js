module.exports = (sequelize, DateTypes) => {

    const Notification = sequelize.define('notifications', {

        to: {
            type: DateTypes.INTEGER,
            allowNull: false,
        },
        
        from: {
            type: DateTypes.INTEGER,
            allowNull: false,
        },

        type: {
            type: DateTypes.STRING,
            field: 'type',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Type should be filled."
                }
            }
        },
        
        idTable: { // Could be notification about offert or application
            type: DateTypes.INTEGER,
            allowNull: false,
        },

        notification: {
            type: DateTypes.STRING,
            field: 'notification',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Notification should be filled."
                }
            }
        },

        status: {
            type: DateTypes.BOOLEAN,
            allowNull: false,
        },
        
        read: {
            type: DateTypes.BOOLEAN,
            defaultValue: false,
        }

    }, {
        paranoid: true
    });
    return Notification;
};