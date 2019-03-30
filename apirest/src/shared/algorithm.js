const env = require('../tools/constants');
const db = require('../database/sequelize');
const axios = require('axios');

class Algorithm {

    constructor() {

    }

    async indexUpdate(id) {


        await this.indexAveragesUpdate(id);
        await this.indexRatioUpdate(id);
        await this.indexProfileUpdate(id);

        // 1- get averages
        let averages = await this.getAverages(id);

        // 2- get ratio
        let ratio = await this.getRatio(id);

        // 3- get profile
        let profile = await this.getProfile(id);

        // and update
        let res = await this.calcAndUpdate(id, averages, ratio, profile);

        return res;
    }

    async calcAndUpdate(id, _averages, _ratio, _profile) {

        let index = 0;

        let avg = [];
        let avgValue = 0;
        let elasticUserP;
        let elasticUserS;

        switch (await this.checkRole(id)) {
            case 'applicant':
                // ratio null
                avg = [_averages.efficiencyAVG, _averages.skillsAVG, _averages.punctualityAVG, _averages.hygieneAVG, _averages.teamworkAVG, _averages.satisfactionAVG];
                avgValue = await this.average(avg);
                // avg MAX = 5
                if (avgValue > 5) {
                    avgValue = 5;
                }
                avgValue = avgValue * 10;

                // profile MAX = 10
                let profile = 0;
                if (_profile > 10) {
                    _profile = 10;
                }
                profile = _profile * 5;

                //console.log("ratio: " + _ratio);
                console.log("======= index ====== ");
                console.log("avg:     " + avgValue);
                console.log("profile: " + profile);
                index = profile + avgValue;
                elasticUserP = 'applicants';
                elasticUserS = 'applicant';
                break;
            case 'offerer':
                avg = [_averages.salaryAVG, _averages.environmentAVG, _averages.partnersAVG, _averages.servicesAVG, _averages.installationsAVG, _averages.satisfactionAVG];
                //console.log("avg Array:" + avg);
                avgValue = await this.average(avg);
                //console.log("Calculated avgvalue:" + avgValue);

                // avg MAX = 5
                if (avgValue > 5) {
                    avgValue = 5;
                }
                avgValue = avgValue * 6;

                // ratio MAX = 5
                let ratio = 0;
                if (_ratio > 5) {
                    _ratio = 5;
                }
                ratio = _ratio * 4;

                // profile MAX = 10
                let profileCalc = 0;
                if (_profile > 10) {
                    _profile = 10;
                }
                profileCalc = _profile * 5;

                //console.log("ratio: " + _ratio);
                console.log("======= index ====== ");
                console.log("ratio:   " + ratio);
                console.log("avg:     " + avgValue);
                console.log("profileCalc: " + profileCalc);
                index = ratio + avgValue + profileCalc;
                elasticUserP = 'offerers';
                elasticUserS = 'offerer';

                break;
        }

        index = await Math.round(index);
        console.log("updating user " + id + " with index " + index);
        let res = await db.users.update({index: index}, {where: {id}})
            .then(ok => {
                console.log("index updated");
                axios.post(`http://${env.ES_URL}/${elasticUserP}/${elasticUserS}/${id}/_update?pretty=true`, {
                    doc: {index}
                }).then(() => {
                    }
                ).catch((error) => {
                    console.log('error elastic: ', error.message);
                });
                return ok;
            })
            .catch(wrong => {
                console.log(wrong);
                return wrong;
            });
        return res;

    }

    async average(arr) {
        let accumulated = 0;
        if (arr.length == 0) {
            for (let i = 0; i < arr.length; i++) {
                accumulated += arr[i];
            }
            accumulated = accumulated / arr.length;
        } else {
            for (let i = 0; i < arr.length; i++) {
                accumulated += arr[i];
            }
            accumulated = accumulated / arr.length;
        }

        return accumulated;
    }


    async getProfile(id) {
        let out = null;
        switch (await this.checkRole(id)) {
            case 'applicant': {
                await db.applicants.findOne({where: {userId: id}, attributes: ['profileComplete']})
                    .then(x => {
                        out = x.profileComplete;
                    });
                break;
            }
            case 'offerer': {
                await db.offerers.findOne({where: {userId: id}, attributes: ['profileComplete']})
                    .then(x => {
                        out = x.profileComplete;
                    });
                break;
            }
        }
        return out;
    }

    async getRatio(id) {
        let ratio = 0;
        switch (await this.checkRole(id)) {
            case 'applicant':
                await db.applicants.findOne(
                    {
                        where: {userId: id},
                        attributes: ['ratioSuccess']
                    })
                    .then(x => {
                        ratio = x.ratioSuccess;
                    });
                break;

            case 'offerer':
                await db.offerers.findOne({
                    where: {userId: id},
                    attributes: ['ratioSuccess']
                })
                    .then(x => {
                        ratio = x.ratioSuccess;
                    });
                break;
        }
        return ratio;
    }

    async getAverages(id) {
        let averages = [];
        switch (await this.checkRole(id)) {
            case 'applicant':
                averages = await db.applicants.findOne(
                    {
                        where:
                            {
                                userId: id
                            },
                        attributes: [
                            'efficiencyAVG',
                            'skillsAVG',
                            'punctualityAVG',
                            'hygieneAVG',
                            'teamworkAVG',
                            'satisfactionAVG'
                        ]
                    });
                break;
            case 'offerer':
                averages = await db.offerers.findOne(
                    {
                        where:
                            {
                                userId: id
                            },
                        attributes: [
                            'salaryAVG',
                            'environmentAVG',
                            'partnersAVG',
                            'servicesAVG',
                            'installationsAVG',
                            'satisfactionAVG'
                        ]
                    });
                break;
        }
        return averages;
    }

    /**
     * Update opinions averages values from ID
     * @param {*} id
     */
    async indexAveragesUpdate(id) {
        console.log("... calculating average opinions...");
        let totalOpinions = 0;

        switch (await this.checkRole(id)) {
            case 'applicant':
                return averagesApplicants(id);
                break;
            case 'offerer':
                return averagesOfferers(id);
                break;
        }

        async function averagesApplicants(id) {

            let efficiency = [];
            let skills = [];
            let punctuality = [];
            let hygiene = [];
            let teamwork = [];
            let satisfaction = [];


            // 2- find applications: status = accepted 
            let applicationsAccepted = await db.applications.findAll({
                where: {
                    status: '0' /* status Accepted */,
                    fk_applicant: id
                },
                attributes: [
                    'id'
                ]
            });

            //console.log("applicationsAccepted: " + applicationsAccepted[0].id);
            if (applicationsAccepted && applicationsAccepted.length > 0) {
                //console.log("applications accepted: " + applicationsAccepted.length);
                // has accepted applications
                // --> find ratingsID


                await algorithm.asyncForEach(applicationsAccepted, null, async (applicationAccepted, index) => {

                    let applicationAcceptedID = applicationAccepted.id;
                    //
                    console.log(" aplication accepted id: " + applicationAcceptedID);

                    let ratingId = await db.ratings.findOne({
                        where: {
                            fk_application: applicationAcceptedID
                        },
                        attributes: [
                            'id'
                        ]
                    });

                    if (ratingId) {
                        let valoration = await db.rating_applicants.findOne({
                            where: {
                                ratingId: ratingId.id
                            },
                            attributes: [
                                'efficiency',
                                'skills',
                                'punctuality',
                                'hygiene',
                                'teamwork',
                                'satisfaction'
                            ]
                        });

                        if (valoration) {
                            //
                            console.log(" - valoration:");
                            console.log(" - " + valoration.efficiency + " " + valoration.skills + " " + valoration.punctuality + " " + valoration.hygiene + " " + valoration.teamwork);

                            efficiency.push(valoration.efficiency);
                            skills.push(valoration.skills);
                            punctuality.push(valoration.punctuality);
                            hygiene.push(valoration.hygiene);
                            teamwork.push(valoration.teamwork);
                            satisfaction.push(valoration.satisfaction);

                            totalOpinions++;
                        }


                    }
                });
            } else {
                console.log("No applications");
            }

            if (totalOpinions > 0) {
                // calculate averages
                efficiency = await algorithm.average(efficiency);
                skills = await algorithm.average(skills);
                punctuality = await algorithm.average(punctuality);
                hygiene = await algorithm.average(hygiene);
                teamwork = await algorithm.average(teamwork);
                satisfaction = await algorithm.average(satisfaction);
            } else {
                efficiency = 0;
                skills = 0;
                punctuality = 0;
                hygiene = 0;
                teamwork = 0;
                satisfaction = 0;
            }

            let values = {
                efficiency,
                skills,
                punctuality,
                hygiene,
                teamwork,
                satisfaction
            };

            // console.log("==========================");
            // console.log(values);
            // console.log("==========================");

            // UPDATE AVERAGES
            let out = await db.applicants.update(
                {
                    efficiencyAVG: values.efficiency,
                    skillsAVG: values.skills,
                    punctualityAVG: values.punctuality,
                    hygieneAVG: values.hygiene,
                    teamworkAVG: values.teamwork,
                    satisfactionAVG: values.satisfaction,
                    nOpinions: totalOpinions
                },
                {where: {userId: id}})
                .then(x => {
                    if (x) {
                        console.log("averages updated to: ");
                        console.log(values);
                        return values
                    } else {
                        console.log("averages not updated");
                        return false;
                    }
                });

            return out;
        }

        async function averagesOfferers(id) {

            let salary = [];
            let environment = [];
            let partners = [];
            let services = [];
            let installations = [];
            let satisfaction = [];

            // 1- find Offers ID: closed --> get IDs
            let offersClosed = await db.offers.findAll({
                where: {
                    status: 1 /* Closed */,
                    fk_offerer: id
                }
            });

            // 2- find applications: status = accepted & offerId = id --> get IDs
            //let offerApplicationsAccepted = null;
            if (offersClosed.length >= 1) {
                //console.log("offersclosed with length");
                await algorithm.asyncForEach(offersClosed, null, async (offerClosed, index) => {

                    let offerClosedID = offerClosed.id;
                    console.log("finding offers closed with id: " + offerClosedID);
                    let applicationsAccepted = await db.applications.findAll({
                        where: {
                            status: '0' /* status Accepted */,
                            fk_offer: offerClosedID
                        }
                    });
                    //console.log("applicationsAccepted: " + applicationsAccepted[0].id);
                    if (applicationsAccepted) {
                        // console.log("has applications accepted (" + applicationsAccepted.length + ")");
                        await algorithm.asyncForEach(applicationsAccepted, null, async (applicationAccepted, index) => {
                            let applicationAcceptedID = applicationAccepted.id;
                            console.log("application accepted id: " + applicationAcceptedID);

                            let ratingId = await db.ratings.findOne({
                                where: {
                                    fk_application: applicationAcceptedID
                                },
                                attributes: [
                                    'id'
                                ]
                            });

                            if (ratingId) {

                                let valoration = await db.rating_offerers.findOne({
                                    where: {
                                        ratingId: ratingId.id
                                    },
                                    attributes: [
                                        'salary',
                                        'environment',
                                        'partners',
                                        'services',
                                        'installations',
                                        'satisfaction'
                                    ]
                                });
                                if (valoration) {
                                    salary.push(valoration.salary);
                                    environment.push(valoration.environment);
                                    partners.push(valoration.partners);
                                    services.push(valoration.services);
                                    installations.push(valoration.installations);
                                    satisfaction.push(valoration.satisfaction);

                                    totalOpinions++;

                                }

                            }
                        });
                    } else {
                        console.log("no applications");
                        //console.log("salary: " +salary);
                    }
                });
            } else {
                console.log("no offers closed");
                //console.log("salary: " +salary);
            }

            if (totalOpinions > 0) {
                // calculate averages

                console.log("Pre-averages:");
                console.log(salary);
                console.log(partners);
                console.log(environment);
                console.log(services);
                console.log(installations);
                console.log(satisfaction);

                salary = await algorithm.average(salary);
                partners = await algorithm.average(partners);
                environment = await algorithm.average(environment);
                services = await algorithm.average(services);
                installations = await algorithm.average(installations);
                satisfaction = await algorithm.average(satisfaction);


            } else {
                // NO calculate averages                
                salary = 0;
                partners = 0;
                environment = 0;
                services = 0;
                installations = 0;
                satisfaction = 0;
            }

            let values = {
                salary,
                partners,
                environment,
                services,
                installations,
                satisfaction
            };

            // // todo 
            console.log("Going to update those values:");
            console.log(values.salary);
            console.log(values.partners);
            console.log(values.environment);
            console.log(values.services);
            console.log(values.installations);

            // UPDATE AVERAGES
            let out = await db.offerers.update(
                {
                    salaryAVG: values.salary,
                    partnersAVG: values.partners,
                    environmentAVG: values.environment,
                    servicesAVG: values.services,
                    installationsAVG: values.installations,
                    satisfactionAVG: values.satisfaction,
                    nOpinions: 1
                },
                {where: {userId: id}}
            )
                .then(x => {
                    if (x) {
                        console.log("averages updated to: ");
                        console.log(values);
                        return values
                    } else {
                        console.log("averages not updated");
                        return false;
                    }
                });
            //let out = true;
            return out;
        }
    }

    /**
     * Update ratio value from ID
     * @param {*} id
     */
    async indexRatioUpdate(id) {
        console.log("... calculating success ratio...");
        switch (await this.checkRole(id)) {
            case 'applicant':
                return _ratioApplicants(id);
                break;
            case 'offerer':
                return ratioOfferers(id);
                break;
        }
        // calculate ratio

        // and update
        async function _ratioApplicants(id) {
            return null;
        }

        async function ratioApplicants(id) {
            let accepted = 0;
            let total = 0;
            // get all closed applications and accepted applications
            let applications = await db.applications.findAndCountAll(
                {
                    where:
                        {
                            fk_applicant: id,
                            status: 0
                        }
                },
                {
                    attributes: ['fk_offer']
                }
            );

            if (applications && applications.length > 0) {
                // user has applications
                // console.log("applications count: ");
                // console.log(applications.count);
                total = applications.count;
                for (let application in applications) {
                    let appAccepted = await db.offers.findOne({where: {id: application.fk_offer, status: 1}});
                    if (appAccepted) {
                        accepted++;
                    }
                    //console.log(x);
                }
                let toUpdate = accepted / total;
                let values = await db.applicants.update(
                    {
                        ratioSuccess: toUpdate
                    },
                    {
                        where: {
                            userId: id
                        }
                    }
                );
                console.log("ratio: " + toUpdate);
            } else {
                // user doesn't have applications
                let values = await db.applicants.update(
                    {
                        ratioSuccess: 0
                    },
                    {
                        where: {
                            userId: id
                        }
                    }
                );
                console.log("ratio: 0");
            }


        }

        async function ratioOfferers(id) {


            // get applications ok
            let offers = 0;
            let total = 0;
            let arr = [];
            let toUpdate = 0;

            // await db.offers.findAndCountAll({
            //     where: {
            //         fk_offerer: id,
            //         status: 0
            //     }
            // })

            // get offers[maxApplicants,currentApplicants] of offer: id
            await db.offerers.findAll({
                where: {
                    userId: id
                },
                include: [{
                    model: db.offers,
                    required: true,
                    where: {
                        status: 1
                    },
                    attributes: [
                        'maxApplicants',
                        'currentApplications',
                        //[db.sequelize.fn('COUNT', 'Status'), 'ClosedCount']
                    ]
                }],
            })
                .then(async out => {
                    var result = out.map((r) => (r.toJSON()));
                    console.log(result);
                    if (result[0] && result[0].offers && result[0].offers.length > 0) {
                        let offers = result[0].offers;
                        for (let i = 0; i < offers.length; i++) {
                            let curr = offers[i].currentApplications;
                            let max = offers[i].maxApplicants;
                            if (curr == 0) {
                                arr[i] = 0;
                            } else {
                                arr[i] = curr / max;
                            }
                        }
                        toUpdate = await algorithm.average(arr);
                    }
                });

            console.log("average ratio " + toUpdate);
            // update
            let values = await db.offerers.update(
                {
                    ratioSuccess: toUpdate
                },
                {
                    where: {
                        userId: id
                    }
                }
            );
            console.log("ratio: " + toUpdate);
        }
    }

    /**
     * Update profile value from ID
     * @param {*} id
     */
    async indexProfileUpdate(id) {
        let points = 0; // max = 10
        // update profile %
        console.log("... calculating profile complete ...");
        switch (await this.checkRole(id)) {
            case 'applicant': {
                // img + bio + 
                await db.users.findOne({where: {id}, attributes: ['bio', 'img', 'lat', 'lon']})
                    .then(result => {
                        if (result && result.dataValues.bio != '' && result.dataValues.bio != 'Here you have a place to define yourself') {
                            // has bio
                            console.log("1- User has bio");
                            points++;
                        }
                        if (result && result.dataValues.img != null) {
                            // has img
                            console.log("1- User has img");
                            points++;
                        }
                        if (result && result.dataValues.lat != null & result.dataValues.lon != null) {
                            // has lat and lon
                            console.log("1- User has lat and lon");
                            points++;
                        }
                    });

                // check rrss
                await db.social_networks.findOne({
                    where: {userId: id},
                    attributes: ['google', 'twitter', 'linkedin', 'telegram']
                })
                    .then(result => {
                        if (result && (result.dataValues.google != null || result.dataValues.twitter != null || result.dataValues.linkedin != null || result.dataValues.telegram != null)) {
                            console.log("1- User has at least 1 RRSS");
                            points++;
                        }
                    });

                // skills
                await db.applicant_skills.findAll({where: {fk_applicant: id}, attributes: ['fk_skill']})
                    .then(result => {
                        if (result && result.length > 0) {
                            if (result.length > 1) {
                                console.log("2- User has >1 skills");
                                points = points + 2;
                            } else if (result.length == 1) {
                                console.log("1- User has 1 skills");
                                points++;
                            }
                        }
                    });

                // experiences
                await db.experiences.findAll({where: {fk_applicant: id}, attributes: ['id']})
                    .then(result => {
                        if (result && result.length > 0) {
                            if (result.length > 1) {
                                console.log("2- User has >1 experience");
                                points = points + 2;
                            } else if (result.length == 1) {
                                console.log("1- User has 1 experience");
                                points++;
                            }
                        }
                    });

                // educations
                await db.applicant_educations.findAll({where: {fk_applicant: id}})
                    .then(result => {
                        if (result && result.length > 0) {
                            if (result.length > 1) {
                                console.log("2- User has >1 educations");
                                points = points + 2;
                            } else if (result.length == 1) {
                                console.log("1- User has 1 educations");
                                points++;
                            }
                        }
                    });

                console.log("--------------");
                console.log("points: " + points + "/10");

                await db.applicants.update({profileComplete: points}, {where: {userId: id}})
                    .then(result => {
                        if (result) {
                            console.log("Profile updated");
                        } else {
                            console.log("Profile not updated");
                        }
                    });
                break;
            }
            case 'offerer': {
                // bio + website + rrss (min 1) 
                await db.users.findOne({where: {id}, attributes: ['bio', 'img', 'lat', 'lon']})
                    .then(result => {
                        if (result && result.dataValues.bio != '') {
                            // has bio
                            console.log("2- User has bio");
                            points = points + 2;
                        }
                        if (result && (result.dataValues.lat != null & result.dataValues.lon != null)) {
                            // has lat and lon
                            console.log("2- User has lat and lon");
                            points = points + 2;
                        }
                    });

                await db.offerers.findOne({where: {userId: id}, attributes: ['website']})
                    .then(result => {
                        if (result && result.dataValues.website != null) {
                            console.log("2- User has website");
                            points = points + 2;
                        }
                    });

                await db.social_networks.findOne({
                    where: {userId: id},
                    attributes: ['google', 'twitter', 'linkedin', 'telegram']
                })
                    .then(result => {
                        if (result && (result.dataValues.google != null || result.dataValues.twitter != null || result.dataValues.linkedin != null || result.dataValues.telegram != null)) {
                            console.log("2- User has at least 1 RRSS");
                            points = points + 2;

                        }
                    });

                // at least 1 offer
                await db.offers.findOne({where: {fk_offerer: id}, attributes: ['id']})
                    .then(result => {
                        if (result && result.length >= 1) {
                            console.log("2- User has at least 1 offer");
                            points = points + 2;
                        }
                    });
                console.log("--------------");
                console.log("points: " + points);
                await db.offerers.update({profileComplete: points}, {where: {userId: id}})
                    .then(result => {
                        if (result) {
                            console.log("Profile updated");
                        } else {
                            console.log("Profile not updated");
                        }
                    });
                break;
            }
        }
    }

    /**
     * Check user role (applicant or offerer)
     * @param {*} id
     */
    async checkRole(id) {

        let user = await db.users.findOne(
            {
                where:
                    {
                        id
                    }
            }
        );
        if (user) {
            let type = await db.applicants.findOne(
                {
                    where:
                        {
                            userId: id
                        }
                }
            );
            if (type) {
                return 'applicant';
            } else {
                return 'offerer';
            }

        }
    }

    async asyncForEach(array, limit, callback) {
        if (limit == null) {
            limit = array.length;
        }
        for (let index = 0; index < limit; index++) {
            await callback(array[index], index, array);
        }
    }
}

const algorithm = new Algorithm();

module.exports = {algorithm};
