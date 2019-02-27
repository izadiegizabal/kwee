module.exports = (sequelize, DataTypes) => {

    const Applicant_Language = sequelize.define('applicant_languages', {

        level: {
            type: DataTypes.ENUM,
            field: 'level',
            allowNull: false,
            values: ["A1", "A2", "B1", "B2", "C1", "C2", "Native"],
            defaultValue: "A1",
            validate: {
              isIn: {
                args: [["A1", "A2", "B1", "B2", "C1", "C2", "Native"]],
                msg: "Invalid level type. A1, A2, B1, B2, C1, C2 and Native levels only admitted."
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