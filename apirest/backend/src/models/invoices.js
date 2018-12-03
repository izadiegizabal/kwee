module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('invoices', {

        fk_applicant: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fk_offer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }

    }, {
        paranoid: true
    });

    return Invoice;
};