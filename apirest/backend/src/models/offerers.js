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

        work_field: {
            type: DataTypes.ENUM,
            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
            allowNull: false
        },

        cif: {
            type: DataTypes.STRING(9),
            field: 'cif',
            allowNull: false
        },

        date_verification: {
            type: DataTypes.DATE,
        },

        about_us: {
            type: DataTypes.TEXT,
            field: 'about us'
        },

        website: {
            type: DataTypes.STRING(50),
            field: 'website'
        },

        company_size: {
            type: DataTypes.ENUM,
            values: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
        },

        year: {
            type: DataTypes.DATE,
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