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
        }, 

        img: {
            type: DateTypes.STRING(50),
            field: 'img',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    });

    return Skill;
};