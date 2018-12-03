module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('users', {

        name: {
            type: DataTypes.STRING(20),
            field: 'name',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Name should be filled."
                },
                isAlphanumeric: {
                    "args": true,
                    "msg": "Name should contain only letters and numbers."
                }
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
                notEmpty: {
                    "args": true,
                    "msg": "Email should be filled."
                },
                isEmail: {
                    "args": true,
                    "msg": "Invalid email."
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                /*is: {
                    "args": /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/g,
                    "msg": "Invalid password. Should be 8-16 length and contain at least 1 letter and at 1 number."
                },*/
            }
        },

        sn_signin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        root: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            
        }

    }, {
        paranoid: true
    });

    return User;
};