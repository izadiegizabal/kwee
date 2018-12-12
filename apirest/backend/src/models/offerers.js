module.exports = (sequelize, DataTypes) => {

    const Offerer = sequelize.define('offerers', {

        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        adress: {
            type: DataTypes.STRING(50),
            field: 'adress',
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Addres should not be empty."
                }
            }
        },

        workField: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            field: 'workField',
            validate: {
                isIn: {
                    args: [[0,1,2,3,4,5,6,7,8]],
                    msg: "Unknown workField value."
                }
            }
        },

        cif: {
            type: DataTypes.STRING(9),
            field: 'cif',
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "CIF should not be empty."
                },
                len: {
                    args: [9,9],
                    msg: "Invalid CIF length."
                }
            }
        },

        website: {
            type: DataTypes.STRING(50),
            field: 'website',
            validate: {
                isUrl: {
                    args: true,
                    msg: "website is not a valid url."
                },
                notEmpty: {
                    args: true,
                    msg: "website should not be empty."
                }
            }
        },
        
        companySize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[10,50,100,1000]],
                    msg: "Invalid companySize value. Only valid 10, 50, 100, or 1.000"
                }
            }
        },
        
        year: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    args: true,
                    msg: "year should be a valid date."
                }
            }
        },
        
        premium: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isIn: {
                    args: [[0,1,2]],
                    msg: "Invalid premium type. Only valid 'basic' (0), 'premium' (1) or 'elite' (2)."
                }
            }
        },

        dateVerification: {
            type: DataTypes.DATE,

            // allowing nulls for testing
            allowNull: true,
            //
            
            validate: {
                isDate: {
                    args: true,
                    msg: "dateVerification is not a valid date"
                }
            }
        }
        
    }, {
        paranoid: true
    });
    return Offerer;
};