module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('users', {

        name: {
            type: DataTypes.STRING(20),
            field: 'name',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        email: {
            type: DataTypes.STRING(50),
            unique: {
                args: true,
                message: 'Username must be unique.'
            },
            field: 'email',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        google: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        root: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    }, {
        paranoid: true
    });

    return User;
};