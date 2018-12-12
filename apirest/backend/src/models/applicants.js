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
                args: [[0,1,2]],
                msg: "Invalid premium type. Only valid 0,1 or 2."
            }
        }
      },

      rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: {
                args: [[0,1,2,3,4,5,6,7,8]],
                msg: "Invalid rol type. Only valid 0,1,2,3,4,5,6,7 or 8."
            }
        }
      }
      
      ///// todo array strings educations
      ///// todo array objetos documentos
    },
    {
      paranoid: true
    }
  );
  return Applicant;
};
