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
            type: DataTypes.INTEGER,
            field: 'status',
            defaultValue: 0,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0, 1, 2, 3, 4, 5]],
                    msg: "status value should be a valid one: 0 (pending), 1 (fav), 2 (selected), 3 (accepted), 4 (refused), or 5 (closed)."
                }
            }
        },

        aHasRated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        oHasRated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        
        aHasRatedDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },

        oHasRatedDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        
        acceptedAt: {
            type: DataTypes.DATE,
            defaultValue: null
        },
    });
    return Application;
};