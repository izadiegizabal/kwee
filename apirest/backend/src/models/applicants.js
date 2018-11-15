module.exports = (sequelize, DataTypes) => {

    const Applicant = sequelize.define('applicants', {

        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        date_born: {
            type: DataTypes.DATE,
        },

        premium: {
            type: DataTypes.ENUM,
            values: ['basic', 'premium'],
            defaultValue: 'basic',
        }

    }, {
        paranoid: true
    });
    return Applicant;
};