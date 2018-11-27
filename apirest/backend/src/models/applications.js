module.exports = (sequelize, DataTypes) => {

    const Application = sequelize.define('applications', {


        fk_applicant: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        fk_offer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
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