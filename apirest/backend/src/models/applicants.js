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
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    args: true,
                    msg: "Date_born should be a date."
                },
                toDate(){
                    let newdate = sequelize.Validator.isISO8601(this.date_born);
                    if( !newdate ){
                        throw new Error('date_born is an invalid date.');
                    }
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
                }
            }
        },



    }, {
        paranoid: true
    });
    return Applicant;
};