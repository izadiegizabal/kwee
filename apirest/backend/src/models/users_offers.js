module.exports = (sequelize, DataTypes) => {

    const User_Offer = sequelize.define('users_offers', {

        status: {
            type: DataTypes.ENUM,
            values: ['active', 'pending', 'deleted'],
            field: 'status',
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        paranoid: true
    });
    return User_Offer;
};