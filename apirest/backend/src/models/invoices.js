module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('invoices', {

        fk_application: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

    }, {
        paranoid: true
    });

    return Invoice;
};