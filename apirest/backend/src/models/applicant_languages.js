module.exports = (sequelize, DataTypes) => {

    const Applicant_Language = sequelize.define('applicant_languages', {

        level: {
            type: DataTypes.ENUM,
            field: 'level',
            allowNull: false,
            values: ["A1", "A2", "B1", "B2", "C1", "C2"],
            defaultValue: "A1",
            validate: {
              isIn: {
                args: [["A1", "A2", "B1", "B2", "C1", "C2"]],
                msg: "Invalid level type. A1, A2, B1, B2, C1 and C2 levels only admitted."
              },
              notEmpty: {
                  args: true,
                  msg: "Level should not be empty"
              }
            }
        }

    });

    return Applicant_Language;
};