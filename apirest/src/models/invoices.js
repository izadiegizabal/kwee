module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('invoices', {

        fk_application: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                args: true,
                message: 'Application must be unique.'
            }
        }

    }, {
        paranoid: true
    });

    return Invoice;
};