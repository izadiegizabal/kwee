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

        work_field: {
            type: DataTypes.ENUM,
            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
            allowNull: false
        },

        cif: {
            type: DataTypes.STRING(9),
            field: 'cif',
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "CIF should not be empty."
                }
            }
        },

        date_verification: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    args: true,
                    msg: "date_verification is not a valid date"
                }
            }
        },

        about_us: {
            type: DataTypes.TEXT,
            field: 'about us',
            validate: {
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9,-. ]+$/,
                    msg: "About us should be a text."
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

        company_size: {
            type: DataTypes.ENUM,
            values: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
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
            type: DataTypes.ENUM,
            values: ['basic', 'premium', 'elite', 'pay as you go'],
            defaultValue: 'basic',
            validate: {
                isIn: {
                    args: [["basic","premium", "elite", "pay as you go"]],
                    msg: "Invalid premium type. Only valid 'basic', 'premium', 'elite' or 'pay as you go'."
                }
            }
        }

    }, {
        paranoid: true
    });
    return Offerer;
};