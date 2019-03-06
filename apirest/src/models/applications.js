module.exports = (sequelize, DataTypes) => {

    const Application = sequelize.define('applications', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        fk_applicant: {
            type: DataTypes.INTEGER,
            allowNull: {
                "args": false,
                "msg": "fk_applicant should point to a valid foreign_key of an applicant id."
            },
            validate: {
                isInt: {
                    "args": true,
                    "msg": "fk_applicant should be an int."
                }
            }
        },

        fk_offer: {
            type: DataTypes.INTEGER,
            allowNull: {
                "args": false,
                "msg": "fk_offerer should point to a valid foreign_key of an offer id."
            },
            validate: {
                isInt: {
                    "args": true,
                    "msg": "fk_offerer should be an int."
                }
            }
        },

        status: {
            type: DataTypes.ENUM,
            field: 'status',
            values: ['active', 'pending', 'deleted'],
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "status shouldn't be empty."
                },
                isIn: {
                    args: [['active', 'pending', 'deleted']],
                    msg: "status value should be a valid one: 'active', 'pending' or 'deleted'."
                }
            }
        }
    }, {
        paranoid: true
    });
    return Application;
};