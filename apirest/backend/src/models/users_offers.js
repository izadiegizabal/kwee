module.exports = (sequelize, DataTypes) => {

    const User_Offer = sequelize.define('users_offers', {

        status: {
            type: DataTypes.ENUM,
            field: 'status',
            values: ['active', 'pending', 'deleted'],
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