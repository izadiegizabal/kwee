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
            values: ['0', '1', '2'],
            defaultValue: '1',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "status shouldn't be empty."
                },
                isIn: {
                    args: [['0', '1', '2']],
                    msg: "status value should be a valid one: 0 (accepted), 1 (pending) or 2 (deleted)."
                }
            }
        }
    }, {
        paranoid: true
    });
    return Application;
};