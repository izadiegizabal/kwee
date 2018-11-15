module.exports = (sequelize, DataTypes) => {

    const Rating = sequelize.define('ratings', {

        fk_application: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
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