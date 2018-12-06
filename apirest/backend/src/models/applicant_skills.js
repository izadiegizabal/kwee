module.exports = (sequelize, DateTypes) => {

    const Applicant_Skill = sequelize.define('applicant_skills', {

        description: {
            type: DateTypes.TEXT,
            field: 'description'
        },

        level: {
            type: DateTypes.STRING(50),
            field: 'level'
        }

    });
    return Applicant_Skill;
};