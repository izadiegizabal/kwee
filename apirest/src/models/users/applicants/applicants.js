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
                args: [[0,1,2]],
                msg: "Invalid premium type. Only valid 'basic' (0), 'premium' (1) or 'elite' (2)."
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
                msg: "Invalid rol type. Only valid 0 (Software Engineering), 1 (Engineering Management), 2 (Design), 3 (Data Analytics), 4 (Developer Operations), 5 (Quality Assurance), 6 (Information Technology), 7 (Project Management) or 8 (Product Management)."
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