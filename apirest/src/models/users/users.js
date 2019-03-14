module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('users', {

        name: {
            type: DataTypes.STRING(),
            field: 'name',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Name should be filled."
                }
            }
        },

        email: {
            type: DataTypes.STRING(100),
            unique: {
                args: true,
                message: 'Email must be unique.'
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
                },
                len: {
                    "args": [0, 100],
                    "msg": "Email too long."
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    "msg": "Password should be filled"
                }
                /*is: {
                    "args": /^(?=^.{8,50}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/g,
                    "msg": "Invalid password. Should be 8-16 length and contain at least 1 letter and at 1 number."
                },*/
            }
        },

        snSignIn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        root: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        img: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },

        bio: {
            type: DataTypes.TEXT(),
            allowNull: false,
            defaultValue: "Here you have a place to define yourself"
        },

        // Last access not saved by query (¿¿auto updated??)
        lastAccess: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.Sequelize.NOW(),
            validate: {
                isDate: {
                    args: true,
                    msg: "lastAccess should be a valid date."
                }
            }
        },

        // Index not saved by query (processed by AI)
        index: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 50,
            validate: {
                isInt: {
                    args: true,
                    msg: "index should be a integer."
                }
            }
        },

        // DEFAULT validation pending
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isIn: {
                    args: [[0, 1, 2, 3, 4]],
                    msg: "Invalid status type. Only valid 'verification pending' (0), 'active' (1), 'validation pending' (2), 'blocked' (3) or social network verification pending(4)."
                }
            }
        },

        twitter: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },

        telegram: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },

        lat: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: true,
            defaultValue: null,
        },

        lon: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: true,
            defaultValue: null,
        }

    }, {
        paranoid: true
    });

    return User;
};