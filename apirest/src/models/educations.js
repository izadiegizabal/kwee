module.exports = (sequelize, DateTypes) => {

    const Education = sequelize.define('educations', {

        title: {
            type: DateTypes.STRING(50),
            field: 'title',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
                    msg: "Title should be letters only (accented letters admitted)."
                }
            }
        },

    });

    return Education;
};