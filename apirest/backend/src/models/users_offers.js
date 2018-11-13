module.exports = (sequelize, DataTypes) => {

    const User_Offer = sequelize.define('users_offers', {

        status: {
            type: DataTypes.STRING,
            field: 'status',
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    });
    return User_Offer;
};