module.exports = (sequelize, DataTypes) => {

    const Rating_Offerer = sequelize.define('rating_offerers', {

        ratingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        
        userRated: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        salary: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
                isInt: true
            }
        },

        environment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
                isInt: true
            }
        },

        partners: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
                isInt: true
            }
        },

        services: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
                isInt: true
            }
        },

        installations: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
                isInt: true
            }
        },

        satisfaction: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 0,
                isInt: true
            }
        }

    }, {
        paranoid: true
    });
    return Rating_Offerer;
};