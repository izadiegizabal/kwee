module.exports = (sequelize, DataTypes) => {

    const Applicant = sequelize.define('applicants', {

        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: {
                    "msg": "City should be filled."
                },
                len: {
                    args: [8,20],
                    msg: "City should be 8-20 length."
                }
            }
        },

        date_born: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: "Date_born should be a valid date."
                },
                notEmpty: {
                    "args": true,
                    "msg": "date_born should be filled."
                }
            }
        },

        premium: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['basic', 'premium'],
            defaultValue: 'basic',
            validate: {
                isIn: {
                    args: [['basic','premium']],
                    msg: "Invalid premium type. Only valid 'basic' and 'premium'."
                },
                notEmpty: {
                    "msg": "Premium should be filled."
                }
            }
        },



    }, {
        paranoid: true
    });
    return Applicant;
};