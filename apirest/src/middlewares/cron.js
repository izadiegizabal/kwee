const { sendEmailInactiveUser, createNotification, sendNotification, getSocketUserId, sendEmailPremiumExpiresAdvise, sendEmailPremiumExpires } = require('../shared/functions');
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
        checkInactiveUsers();
        checkRatings();
        checkPayments();

    }, null, true, timezone);

    daily.start();

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

async function checkRatings() {
    try {
        let users = await db.users.findAll();
        let applications = await db.applications.findAll();
        let offers = await db.offers.findAll();
        let offerers = await db.offerers.findAll();
        applications.forEach( application => {
            let offerAux = offers.find( offer => offer.id === application.fk_offer );
            let offererAux = offerers.find( offerer => offerer.userId === offerAux.fk_offerer );
            if ( application.aHasRated === 0 ) {
                let user = users.find( element => element.id === application.fk_applicant );
                let socketId = getSocketUserId(user.email);
                if ( moment(now).diff(application.aHasRatedDate, "months") >= 1 ) {
                    // enviar notificación
                    createNotification(db, application.fk_applicant, offererAux.userId, 'applications', application.id, 'rating', false);
                    if (socketId) sendNotification('rating', socketId, application, false);
                }
            }
            if ( application.oHasRated === 0 ) {
                let user = users.find( element => element.id === offererAux.userId );
                if ( moment(now).diff(application.oHasRatedDate, "months") >= 1 ) {
                    // enviar notificación
                    createNotification(db, offererAux.userId, application.fk_applicant, 'applications', application.id, 'rating', false);
                    if (socketId) sendNotification('rating', socketId, application, false);
                }
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

async function checkPayments() {
    let users = await db.users.findAll({ include: [ db.invoices ]});
    let applicants = await db.users.findAll({ 
        include: [{
                model: db.applicants,
                where: { premium: 1 }
            }],
            attributes: { exclude: ['password', 'root'] }
        }
    );

    let offerers = await db.users.findAll({ 
            include: [{
                    model: db.offerers,
                    where: { premium: 1 }
                }],
                attributes: { exclude: ['password', 'root'] }
            }
        );

    var users = applicants.concat(offerers);

    usersToNotify(users);
    usersToRevokePremium(users);
}


async function usersToNotify(users) {
    users.forEach( async user => {
        if ( user.lastPayment ) {
            let date = moment(user.lastPayment);
            if ( date.diff(now, 'days') == -25 ) {
                // enviar email notificación faltan 5 días para acabar el premium
                sendEmailPremiumExpiresAdvise(user);
            }
        }
        
    });
}
async function usersToRevokePremium(users) {
    users.forEach( async user => {
        if ( user.lastPayment ) {
            let date = moment(user.lastPayment);
            if ( date.diff(now, 'days') == -31 ) {
                // quitar premium y pasar a free
                if ( "applicant" in user ) {
                    await db.applicants.update({ premium: 0 }, {
                        where: { userId: user.id }
                    });
                }
                if ( "offerer" in user ) {
                    await db.offerers.update({ premium: 0 }, {
                        where: { userId: user.id }
                    });
                }
                sendEmailPremiumExpires(user);
            }
        }
        
    });
}

module.exports = CronJob;