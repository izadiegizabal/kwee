module.exports = (sequelize, DataTypes) => {
  const Applicant = sequelize.define(
    "applicants",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },

      city: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City should be filled."
          },
          len: {
            args: [8, 20],
            msg: "City should be 8-20 length."
          }
        }
      },

      date_born: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "Date_born should be a date."
          },
          toDate() {
            try {
              let validDate = new Date(this.date_born);

              let newdate = sequelize.Validator.isISO8601(
                validDate.toISOString(),
                {
                  options: {
                    strict: true
                  }
                }
              );
              
              if (newdate) {
                this.date_born = validDate.toISOString();
              }
              else{
                throw new Error('Invalid date_born value.');
              }
            } catch (error) {
              throw new Error(error.errors?error.errors[0].message:error.message);
            }
          }
        }
      },

      premium: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["basic", "premium"],
        defaultValue: "basic",
        validate: {
          isIn: {
            args: [["basic", "premium"]],
            msg: "Invalid premium type. Only valid 'basic' and 'premium'."
          }
        }
      }
    },
    {
      paranoid: true
    }
  );
  return Applicant;
};
