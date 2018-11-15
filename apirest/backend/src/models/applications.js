module.exports = (sequelize, DataTypes) => {

    const Application = sequelize.define('applications', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },

        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fk_offer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

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
    return Application;
};