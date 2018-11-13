module.exports = (sequelize, DataTypes) => {

    const Social_Network = sequelize.define('social_networks', {

        twitter: {
            type: DataTypes.STRING,
            field: 'twitter',
            allowNull: true
        },

        instagram: {
            type: DataTypes.STRING,
            field: 'instagram',
            allowNull: true
        },

        telegram: {
            type: DataTypes.STRING,
            field: 'telegram',
            allowNull: true
        },

        linkedin: {
            type: DataTypes.STRING,
            field: 'linkedin',
            allowNull: true
        },

    }, {
        paranoid: true
    });

    return Social_Network;
};