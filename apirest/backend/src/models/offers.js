module.exports = (sequelize, DateTypes) => {

    const Offer = sequelize.define('offers', {

        fk_offerer: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "fk_offerer should not be empty."
                },
                isInt: {
                    "args": true,
                    "msg": "fk_offerer invalid type."
                }/*,
                custom() {
                    console.log("fk_offerer:" + this.fk_offerer);
                    const user = sequelize.models.offerers.findOne({where: {userId: this.fk_offerer}})
                        .then( u => {
                            if( u == null ){
                                throw new sequelize.ValidationError("fk_offerer is not pointing to an offerer.");
                            }
                        })
                }*/
            }
        },

        title: {
            type: DateTypes.STRING(50),
            field: 'title',
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Title should be filled."
                },
                len: {
                    args: [5,50],
                    msg: "Title should be 5-50 characters long."
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
                    args: [40, 140],
                    msg: 'Description must be [40, 140] characters.'
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
        },


        /////////////////

        // status --> open, closed, draft, selection (INTs)

        // datePublished

        // * duration --> int
        // * durationUnit --> enum 0,1,2
        // * indefinite --> boolean

        // salaryFrecuency --> enum 0,1,2,3

        // salaryCurrency --> string

        // workLocationType --> enum 0,1,2

        // seniority --> enum 0,1,2,3

        // responsabilities --> text 

        // requirements

        // skills --> array strings



    },
    {
        paranoid: true
    }
      
    /*,{
        paranoid: true
    }*/);
    return Offer;
};