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
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
                    msg: "Name should be letters only (accented letters admitted)."
                }
            }
        },

        email: {
            type: DataTypes.STRING(50),
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
        
        /////////////////
        
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        
        bio: {
            type: DataTypes.TEXT(),
            allowNull: false,
            defaultValue: "Here you have a place to define yourself",
            validate: {
                len: {
                    args: [15,500],
                    msg: "Bio length should be min 15 max 500"
                },
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9,-. ]+$/,
                    msg: "Bio should be a text."
                }
            }
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
            defaultValue: 0,
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
                    args: [[0,1,2,3]],
                    msg: "Invalid status type. Only valid 'verification pending' (0), 'active' (1), 'validation pending' (2) or 'blocked' (3)."
                }
            }
        }


    }, {
        paranoid: true
    });

    return User;
};