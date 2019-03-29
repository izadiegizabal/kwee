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

        img: {
            type: DateTypes.STRING,
            allowNull: true,
            defaultValue: null,
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
                    if (this.dateStart < this.dateEnd ) {
                        throw new Error('Starting date must be after date of selection starts.');
                    }
                    else if( this.dateStart <= today) {
                        throw new Error('Starting date must be after today\'s date.');
                    }
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

        
        status: {
            type: DateTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid status type. Only valid 0 (Open), 1 (Closed), 2 (Draft), 3 (Selection)."
                }
            }
        },
        
        
        salaryAmount: {
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
        salaryFrequency: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid salary type. Only valid 0 (per hour), 1 (per month), 2 (per year) or 3 (for the project)."
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
                    msg: "Invalid workLocation type. Only valid 0 (On Site), 1 (Remote) or 2 (Partially Remote)."
                }
            }
        },

        seniority: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid seniority type. Only valid 0 (Entry-Junior), 1 (Intermediate), 2 (Senior) or 3 (Lead)."
                }
            }
        },

        maxApplicants: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "maxApplicants should be filled (integer). maxApplicants = Max of jobs offered"
                }
            }
        },

        currentApplications: {
            type: DateTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        duration: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "Duration should be filled (integer). Is the quantity of durationUnit. (2 duration of 2 durationUnit = 2 years)"
                }
            }
        },

        durationUnit: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2]],
                    msg: "Invalid duration number. Only 0 (for days), 1 (for months) or 2 (for years)."
                }
            }
        },

        isIndefinite: {
            type: DateTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    "args": true,
                    "msg": "isIndefinite should be filled (boolean)."
                }
            }
        },

        contractType: {
            type: DateTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0,1,2,3]],
                    msg: "Invalid contract type number. Only 0 (Full-Time), 1 (Part-Time), 2 (Internship) or 3 (End of Degree Project)."
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
        },

        lat: {
            type: DateTypes.DECIMAL(9,6),
            allowNull: true,
            defaultValue: null,
        },

        lon: {
            type: DateTypes.DECIMAL(9,6),
            allowNull: true,
            defaultValue: null,
        }

        /////////////////

       
        // @todo and @tocheck
        // * duration --> int (1,2,3...)
        // * durationUnit --> enum 0,1,2 = (semana / mes / año)
        // * indefinite --> boolean

        // salaryFrequency --> enum 0,1,2,3 = (mes / proyecto / ?? )

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