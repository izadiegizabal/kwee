module.exports = (sequelize, DateTypes) => {

    const Offer = sequelize.define('offers', {

        fk_offerer: {
            type: DateTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DateTypes.STRING(50),
            field: 'title',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Title should be filled."
                }
            }
        },

        description: {
            type: DateTypes.TEXT,
            field: 'description',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Description should be filled."
                },
                len: {
                    "args": [140,500],
                    "msg": "Description sohuld be 140-500 length."
                }
            }
        },

        date_start: {
            type: DateTypes.DATE,
            field: 'date_start',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Starting date should be filled."
                },
                isDate: {
                    "args": true,
                    "msg": "Starting date should be a date."
                }
            }
        },

        date_end: {
            type: DateTypes.DATE,
            field: 'date_end',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Starting date should be filled."
                },
                isDate: {
                    "args": true,
                    "msg": "Starting date should be a date."
                },
                startDateAfterEndDate() {
                    const today = new Date();
                    if (this.date_start >= this.date_end ) {
                        throw new Error('Start date must be before the end date.');
                    }
                    else if( this.date_start <= today) {
                        throw new Error('Start date must be after today\'s date.');
                    }
                }
                
            }
        },

        location: {
            type: DateTypes.STRING(50),
            field: 'location',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Location should be filled."
                },
                len: {
                    "args": [5,50],
                    "msg": "Description sohuld be 5-20 length."
                }
            }
        },

        salary: {
            type: DateTypes.INTEGER,
            field: 'salary',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Salary should be filled."
                },
                isNumeric: {
                    "args": true,
                    "msg": "Salary should be a number."
                }
            }
        }
    },
    {
        paranoid: true
    }
      
    /*,{
        paranoid: true
    }*/);
    return Offer;
};