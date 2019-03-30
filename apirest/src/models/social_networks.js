module.exports = (sequelize, DataTypes) => {

    const Social_Network = sequelize.define('social_networks', {

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                args: true,
                message: 'This social network has user.'
            }
        },

        google: {
            type: DataTypes.STRING(50),
            field: 'google',
            allowNull: true
        },

        twitter: {
            type: DataTypes.STRING(50),
            field: 'twitter',
            allowNull: true
        },

        github: {
            type: DataTypes.STRING(50),
            field: 'github',
            allowNull: true
        },

        instagram: {
            type: DataTypes.STRING(50),
            field: 'instagram',
            allowNull: true
        },

        telegram: {
            type: DataTypes.STRING(50),
            field: 'telegram',
            allowNull: true
        },

        linkedin: {
            type: DataTypes.STRING(50),
            field: 'linkedin',
            allowNull: true
        },

    }, {
        paranoid: true
    });

    return Social_Network;
};
