
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
            case 'applicant':

            break;
            case 'offerer':

            break;
        }
        
        // 1- get averages
        
        // 2- get ratio
        
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

        function averagesApplicants( id ) {
            
        }
        
        function _averagesOfferers( id ) {
            let ratings = db.rating_offerers.findAll({attributes: ['ratingId']});
            for(let rating in ratings) {

            }
        }

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

            let values = {
                salary,
                partners,
                environment,
                services,
                installations
            }

            // todo 

            // calculate average
            async function average(arr) {
                let accumulated = 0;
                for(let i=0; i<arr.length; i++) {
                    accumulated += arr[i];
                }
                accumulated = accumulated / arr.length;

                return accumulated;
            }
            // UPDATE AVERAGES
            
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
            
        }

        async function ratioOfferers(id) {

        }
    }

    /**
     * Update profile value from ID
     * @param {*} id 
     */
    async indexProfileUpdate( id ) {
        // update profile %
    }

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
}

const algorithm = new Algorithm();

module.exports = algorithm;