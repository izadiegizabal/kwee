module.exports = (sequelize, DateTypes) => {

    const Skill = sequelize.define('skills', {

        name: {
            type: DateTypes.STRING(20),
            field: 'name',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }

    });

    return Skill;
};