module.exports = (sequelize, DataTypes) => {

    const Rating_Applicant = sequelize.define('rating_applicants', {

        ratingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        efficience: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        skills: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        puntuality: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        hygiene: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        teamwork: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // overall satisfaction --> FLOAT

    }, {
        paranoid: true
    });
    return Rating_Applicant;
};