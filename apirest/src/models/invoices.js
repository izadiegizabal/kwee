module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('invoices', {

        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        userName: {
            type: DataTypes.STRING(),
            field: 'userName',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Name should be filled."
                }
            }
        },

        product: {
            type: DataTypes.STRING(),
            field: 'product',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Product should be filled."
                }
            }
        },

        price: {
            type: DataTypes.STRING(),
            field: 'price',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Price should be filled."
                }
            }
        }

    }, {
        paranoid: true
    });

    return Invoice;
};
