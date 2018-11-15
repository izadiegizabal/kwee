module.exports = (sequelize, DateTypes) => {

    const Skill = sequelize.define('skills', {

        name: {
            type: DateTypes.STRING,
            field: 'name',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },

        description: {
            type: DateTypes.TEXT,
            field: 'description',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        level: {
            type: DateTypes.STRING,
            field: 'level',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    }, {
        paranoid: true
    });
    return Skill;
};