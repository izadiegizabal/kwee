module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('users', {

        name: {
            type: DataTypes.STRING,
            field: 'name',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        email: {
            type: DataTypes.STRING,
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

        root: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }

    }, {
        paranoid: true
    });
    return User;
};