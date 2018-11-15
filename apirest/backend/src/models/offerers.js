module.exports = (sequelize, DataTypes) => {

    const Offerer = sequelize.define('offerers', {

        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        adress: {
            type: DataTypes.STRING(50),
            field: 'adress',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        phone: {
            type: DataTypes.STRING(20),
            field: 'phone'
        },

        cif: {
            type: DataTypes.STRING(9),
            field: 'cif'
        },

        date_verification: {
            type: DataTypes.DATE,
        },

        enterprise: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },

        particular: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },

        premium: {
            type: DataTypes.ENUM,
            values: ['basic', 'premium', 'elite', 'pay as you go'],
            defaultValue: 'basic',
        }

    }, {
        paranoid: true
    });
    return Offerer;
};