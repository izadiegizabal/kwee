
const db = require('../database/sequelize');

class Algorithm {

    /**
     * General index function. Gets values (updated from the functions below) and calculates our Kwee index
     * @param {*} id ID of the user to update index
     */
    async indexUpdate( id ) {

        let offers = await db.offers.findAll();

        let role = checkRole( id );

        switch(role){
            case 'applicant':{
                // 1- get averages
                await db.applicants.findOne(
                    {
                        where:
                        {
                           id 
                        },
                        attributes: [
                            'nOpinions',
                            'efficiencyAVG',
                            'skillsAVG',
                            'punctualityAVG',
                            'hygieneAVG',
                            'teamworkAVG'
                        ]
                    }
                );
                // 2- get ratio

                break;
            }
            case 'offerer':{

                break;
            }
        }
        
        

        
        // 3- get profile
        
        // calculate index

        // and update

    }

    /**
     * Update opinions averages values from ID
     * @param {*} id 
     */
    async indexAveragesUpdate( id ) {

        let totalOpinions = 0;

        switch( await this.checkRole( id ) ){
            case 'applicant':
                return averagesApplicants(id);
            break;
            case 'offerer':
                return averagesOfferers(id);
            break;
        }

       

        // Applicants average
        async function averagesApplicants( id ) {
                
            let efficiency = [];
            let skills = [];
            let punctuality = [];
            let hygiene = [];
            let teamwork = [];

            // 1- find Offers ID: closed --> get IDs
            let offersClosed = await db.offers.findAll({
                where: {
                    // status: '1' /* Closed */
                },
                attributes: [
                    'id'
                ]
            });
            //return offers;
            
            // 2- find applications: status = accepted & offerId = id --> get IDs
            // Get ID application of offersclosed and application accepted
            for(let offerClosed in offersClosed){

                let offerClosedID = offersClosed[offerClosed].id;

                let applicationsAccepted = await db.applications.findAll({
                    where: {
                        // status: '0' /* status Accepted */,
                        fk_offer: offerClosedID,
                        fk_applicant: id
                    },
                    attributes: [
                        'id'
                    ]
                });
                if( applicationsAccepted ) {
                    // has accepted applications
                    // --> find ratingsID
                    for(let applicationAccepted in applicationsAccepted) {
                        
                        let applicationAcceptedID = applicationsAccepted[applicationAccepted].id;
                        
                        let ratingId = await db.ratings.findOne({
                            where: {
                                fk_application: applicationAcceptedID
                            },
                            attributes: [
                                'id'
                            ]
                        });
                        console.log(ratingId.id);
                        if( ratingId ) {
                            let valoration = await db.rating_applicants.findOne({
                                where: {
                                    ratingId: ratingId.id
                                },
                                attributes: [
                                    'efficiency',
                                    'skills',
                                    'punctuality',
                                    'hygiene',
                                    'teamwork'
                                ]
                            });
                            
                            efficiency.push(valoration.efficiency);
                            skills.push(valoration.skills);
                            punctuality.push(valoration.punctuality);
                            hygiene.push(valoration.hygiene);
                            teamwork.push(valoration.teamwork);

                            totalOpinions++;

                        }
                    }
                }

            }
            
            console.log("totalOpinions: " + totalOpinions);

            efficiency = await average(efficiency);
            skills = await average(skills);
            punctuality = await average(punctuality);
            hygiene = await average(hygiene);
            teamwork = await average(teamwork);

            // todo 

            // UPDATE AVERAGES
            const values = await db.applicants.update(
                {
                    efficiencyAVG: efficiency,
                    skillsAVG: skills,
                    punctualityAVG: punctuality,
                    hygieneAVG: hygiene,
                    teamworkAVG: teamwork,
                    nOpinions: totalOpinions
                },
                {
                    where: {
                        userId: id
                    }
                }
            );

            return values;

        }

        // Offerers average
        async function averagesOfferers(id) {
            
            let salary = [];
            let environment = [];
            let partners = [];
            let services = [];
            let installations = [];

            // 1- find Offers ID: closed --> get IDs
            let offersClosed = await db.offers.findAll({
                where: {
                    // status: '1' /* Closed */,
                    fk_offerer: id
                },
                attributes: [
                    'id'
                ]
            });
            //return offers;
            
            // 2- find applications: status = accepted & offerId = id --> get IDs
            //let offerApplicationsAccepted = null;
            for(let offerClosed in offersClosed){

                let offerClosedID = offersClosed[offerClosed].id;

                let applicationsAccepted = await db.applications.findAll({
                    where: {
                        // status: '0' /* status Accepted */,
                        fk_offer: offerClosedID
                    },
                    attributes: [
                        'id'
                    ]
                });
                //console.log("applicationsAccepted: " + applicationsAccepted[0].id);
                if( applicationsAccepted ) {
                    // has accepted applications
                    // --> find ratingsID
                    for(let applicationAccepted in applicationsAccepted) {
                        
                        let applicationAcceptedID = applicationsAccepted[applicationAccepted].id;
                        
                        let ratingId = await db.ratings.findOne({
                            where: {
                                fk_application: applicationAcceptedID
                            },
                            attributes: [
                                'id'
                            ]
                        });
                        console.log(ratingId.id);
                        if( ratingId ) {
                            let valoration = await db.rating_offerers.findOne({
                                where: {
                                    ratingId: ratingId.id
                                },
                                attributes: [
                                    'salary',
                                    'environment',
                                    'partners',
                                    'services',
                                    'installations'
                                ]
                            });
                            
                            salary.push(valoration.salary);
                            environment.push(valoration.environment);
                            partners.push(valoration.partners);
                            services.push(valoration.services);
                            installations.push(valoration.installations);

                            totalOpinions++;

                        }
                    }
                }

            }
            console.log("salary: " + salary);
            
            console.log("totalOpinions: " + totalOpinions);

            salary = await average(salary);
            partners = await average(partners);
            environment = await average(environment);
            services = await average(services);
            installations = await average(installations);

            // todo 

            // UPDATE AVERAGES
            const values = await db.offerers.update(
                {
                    salaryAVG: salary,
                    partnersAVG: partners,
                    environmentAVG: environment,
                    servicesAVG: services,
                    installationsAVG: installations,
                    nOpinions: totalOpinions
                },
                {
                    where: {
                        userId: id
                    }
                }
            );

            return values;
        }
    }

    /**
     * Update ratio value from ID
     * @param {*} id 
     */
    async indexRatioUpdate( id ) {

        switch( await this.checkRole( id ) ){
            case 'applicant':
                return ratioApplicants(id);
            break;
            case 'offerer':
                return ratioOfferers(id);
            break;
        }
        // calculate ratio

        // and update

        async function ratioApplicants(id) {
            // get applications ok
            let applications = 0;
            let applicationsOK = 0;
            await db.applications.findAndCountAll({
                where: {
                    fk_applicant: id,
                    // status: 0, /* applications accepted */
                }
            })
            .then( result => {
                applicationsOK = result.count;
            });
            // get total
            await db.applications.findAndCountAll({
                where: {
                    fk_applicant: id
                }
            })
            .then( result => {
                applications = result.count;
            });
            // check GROUP BY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // calculate ratio
            let total = applicationsOK / applications;
            
            // update
            let values = await db.applicants.update(
                {
                    where: {
                        id
                    }
                },
                {
                    ratioSuccess: total
                }
            );

            return values;
        }

        async function ratioOfferers(id) {
            // get applications ok
            let offers = 0;
            let total = 0;
            let arr = [];
            let toUpdate = 0;
            let offers = await db.offers.findAndCountAll({
                where: {
                    fk_applicant: id,
                    // status: 0, /* applications accepted */
                },
                attributes: [
                    'maxApplicants',
                    'currentApplications'
                ]
            })
            .then( result => {
                for(let offer in offers) {
                    arr[i] = offer.currentApplications / maxApplicants;
                }
                toUpdate = await average(arr);
            });

            // update
            let values = await db.applicants.update(
                {
                    where: {
                        id
                    }
                },
                {
                    ratioSuccess: toUpdate
                }
            );

            return values;
        }
    }

    /**
     * Update profile value from ID
     * @param {*} id 
     */
    async indexProfileUpdate( id ) {
        // update profile %
    }

    //////////////////////////
    // Helper functions
    //////////////////////////

    /**
     * Check user role (applicant or offerer)
     * @param {*} id 
     */
    async checkRole( id ) {
        
        let user = await db.users.findOne(
                {
                    where:
                    {
                        id
                    }
                }
        );
        if( user ){
            let type = await db.applicants.findOne(
                {
                    where:
                    {
                        userId:id
                    }
                }
            );
            if( type ) {
                return 'applicant';
            }
            else{
                return 'offerer';
            }

        }
    }

    // calculate average
    async average(arr) {
        let accumulated = 0;
        for(let i=0; i<arr.length; i++) {
            accumulated += arr[i];
        }
        accumulated = accumulated / arr.length;

        return accumulated;
    }
}

const algorithm = new Algorithm();

module.exports = algorithm;