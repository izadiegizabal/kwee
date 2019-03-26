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
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City should be filled."
          }
        }
      },

      dateBorn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "dateBorn should be a date."
          }
        }
      },

      premium: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1, 2]],
            msg:
              "Invalid premium type. Only valid 'basic' (0), 'premium' (1) or 'elite' (2)."
          }
        }
      },

      rol: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      // Index stuff
      efficiencyAVG: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },
      skillsAVG: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },
      punctualityAVG: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },
      hygieneAVG: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },
      teamworkAVG: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },

      satisfactionAVG: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },

      nOpinions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true
        }
      },
      profileComplete: {
        type: DataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      },
      ratioSuccess: {
        type: DataTypes.FLOAT(4, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFloat: true
        }
      }
    },
    {
      paranoid: true
    }
  );
  return Applicant;
};
