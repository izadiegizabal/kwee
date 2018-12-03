module.exports = (sequelize, DataTypes) => {

    const Rating = sequelize.define('ratings', {

        fk_applicant: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fk_offer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        overall: {
            type: DataTypes.DOUBLE,
            field: 'overall',
            allowNull: true
        }

    }, {
        paranoid: true
    });

    return Rating;
};