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
                }
            }
        },

        title: {
            type: DateTypes.STRING(50),
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
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Description should be filled."
                }
            }
        },

        dateStart: {
            type: DateTypes.DATE,
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

        dateEnd: {
            type: DateTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Ending date should be filled."
                },
                isDate: {
                    "args": true,
                    "msg": "Ending date should be a date."
                },
                startDateAfterEndDate() {
                    const today = new Date();
                    if (this.dateStart >= this.dateEnd ) {
                        throw new Error('Starting date must be before the end date.');
                    }
                    else if( this.dateStart <= today) {
                        throw new Error('Starting date must be after today\'s date.');
                    }
                }
                
            }
        },

        location: {
            type: DateTypes.STRING(),
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

        status: {
            type: DateTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid status type. Only valid 0,1,2 or 3."
                }
            }
        },

        datePublished: {
            type: DateTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Published date should be filled."
                },
                isDate: {
                    "args": true,
                    "msg": "Published date should be a date."
                }
            }
        },

        salaryFrecuency: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid salary type. Only valid 0,1,2 or 3."
                }
            }
        },

        salaryCurrency: {
            type: DateTypes.STRING(3),
            allowNull: false,
            validate: {
                len: {
                    args: [3,3],
                    msg: "Salary currency invalid value. Should be 3 character length (EUR, USD, GBP...)"
                }
            }
        },

        workLocation: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2]],
                    msg: "Invalid workLocation type. Only valid 0,1 or 2."
                }
            }
        },

        seniority: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid seniority type. Only valid 0,1,2 or 3."
                }
            }
        },

        responsabilities: {
            type: DateTypes.TEXT,
            allowNull: true
        },

        requeriments: {
            type: DateTypes.TEXT,
            allowNull: true
        },

        skills: {
            type: DateTypes.TEXT,
            allowNull: true,
        }

        /////////////////

       
        // @todo and @tocheck
        // * duration --> int (1,2,3...)
        // * durationUnit --> enum 0,1,2 = (semana / mes / año)
        // * indefinite --> boolean

        // salaryFrecuency --> enum 0,1,2,3 = (mes / proyecto / ?? )

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