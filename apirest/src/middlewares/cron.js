const { sendEmailInactiveUser } = require('../shared/functions');
const db = require('../database/sequelize');
const env = require('../tools/constants');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const axios =   require('axios');

let now = moment();
let timezone = 'Europe/Madrid';
/*
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
*/

try {
    const daily = new CronJob('00 00 00 * * *', function() {
      
        checkOffersDateEndToSelection();
        checkOffersInSelectionToClose();

    }, null, true, timezone);

    const monthly = new CronJob('* * * 01 * *', function() {
      
        checkInactiveUsers();

    }, null, true, timezone);

    daily.start();
    monthly.start();

} catch (error) {
    throw new Error(error);
}

async function checkOffersDateEndToSelection() {
    try {
        let offers = await db.offers.findAll({ where: { status: 0 }});
        if ( offers ) {
            offers.forEach( async offer => {
                let dateEnd = moment(offer.dateEnd);
                if ( moment(dateEnd).isBefore(now) ) {
                    await db.offers.update({status: 3}, {
                        where: { id: offer.id }
                    }).then(result => {
                        if ( result == 1 ) {
                            axios.post(`http://${ env.ES_URL }/offers/offer/${ offer.id }/_update?pretty=true`, {
                                doc: {status: 3}
                            }).then((resp) => {
                                // updated from elasticsearch database too
                            }).catch((error) => {
                                console.log(error.message);
                            });
                        }
                    });
                }
            });
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function checkOffersInSelectionToClose() {
    try {
        let offers = await db.offers.findAll({ where: { status: 3 }});

        if ( offers ) {
            offers.forEach( async offer => {
                let dateEnd = moment(offer.dateEnd);
                if ( moment(now).diff(dateEnd, "months") >= 1 ) {
                    await db.offers.update({status: 1}, {
                        where: { id: offer.id }
                    }).then(result => {
                        if ( result == 1 ) {
                            axios.post(`http://${ env.ES_URL }/offers/offer/${ offer.id }/_update?pretty=true`, {
                                doc: {status: 1}
                            }).then((resp) => {
                                // updated from elasticsearch database too
                            }).catch((error) => {
                                console.log(error.message);
                            });
                        }
                    });
                }
            });
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function checkInactiveUsers() {
    try {
        let users = await db.users.findAll();
        if ( users ) {
            users.forEach(user => {
                let lastAccess = moment(user.lastAccess);
                if ( moment(now).diff(lastAccess, "months") >= 1 ) {
                    sendEmailInactiveUser(user);
                }
            });
        }
    } catch (error) {
        
    }
}

module.exports = CronJob;