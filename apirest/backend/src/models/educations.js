module.exports = (sequelize, DateTypes) => {

    const Education = sequelize.define('educations', {

        title: {
            type: DateTypes.STRING,
            field: 'title',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }

    }, {
        paranoid: true
    });
    return Education;
};