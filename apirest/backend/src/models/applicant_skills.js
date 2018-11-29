module.exports = (sequelize, DateTypes) => {

    const Applicant_Skill = sequelize.define('applicant_skills', {

        description: {
            type: DateTypes.TEXT,
            field: 'description',
            // allowNull: false,
            // validate: {
            //     notEmpty: true
            // }
        },

        level: {
            type: DateTypes.STRING(50),
            field: 'level',
            // allowNull: false,
            // validate: {
            //     notEmpty: true
            // }
        },

    }, {
        paranoid: true
    });
    return Applicant_Skill;
};