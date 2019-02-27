module.exports = (sequelize, DataTypes) => {

    const Rating_Applicant = sequelize.define('rating_applicants', {

        ratingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        efficiency: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 0,
                isInt: true
            }
        },

        skills: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 0,
                isInt: true
            }
        },

        punctuality: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 0,
                isInt: true
            }
        },

        hygiene: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 0,
                isInt: true
            }
        },

        teamwork: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 5,
                min: 0,
                isInt: true
            }
        },

        // overall satisfaction --> FLOAT

    }, {
        paranoid: true
    });
    return Rating_Applicant;
};