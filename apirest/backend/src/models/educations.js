module.exports = (sequelize, DateTypes) => {

    const Education = sequelize.define('educations', {

        title: {
            type: DateTypes.STRING(50),
            field: 'title',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }

    });

    return Education;
};