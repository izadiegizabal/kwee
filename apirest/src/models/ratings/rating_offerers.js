module.exports = (sequelize, DataTypes) => {

    const Rating_Offerer = sequelize.define('rating_offerers', {

        ratingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        salary: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        enviroment: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        partners: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        services: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        instalations: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

    }, {
        paranoid: true
    });
    return Rating_Offerer;
};