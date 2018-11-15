module.exports = (sequelize, DataTypes) => {

    const Offerer = sequelize.define('offerers', {

        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        adress: {
            type: DataTypes.STRING,
            field: 'adress',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        phone: {
        type: DataTypes.STRING,
            field: 'phone'
        },

        cif: {
            type: DataTypes.STRING,
            field: 'cif'
        },

        date_verification: {
            type: DataTypes.STRING,
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