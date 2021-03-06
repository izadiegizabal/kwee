module.exports = (sequelize, DataTypes) => {

    const Rating = sequelize.define('ratings', {

        fk_application: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        overall: {
            type: DataTypes.DOUBLE,
            field: 'overall',
            allowNull: true
        },

        opinion: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }, {
        paranoid: true
    });

    return Rating;
};