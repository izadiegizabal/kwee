var elasticsearch = require('elasticsearch');
const env = require('../tools/constants');

var client = new elasticsearch.Client({
    //If you want to use this configuration on production server, just uncomment the commented part and comment
    host: env.ES_URL,
    // log: 'trace'
    //configuration for production server
    /*hosts: [
        'https://[username]:[password]@[server]:[port]/',
        'https://[username]:[password]@[server]:[port]/'
    ]*/

});

client.indices.exists({
    index: 'applicants'
}).then(function (exists) {
    if (!exists) {
        client.indices.create({
            index: "applicants",
            body: {
                mappings: {
                    applicant: {
                        properties: {
                            name: {type: "text", "fielddata": true},
                            email: {type: "text"},
                            status: {type: "integer", "doc_values": true},
                            city: {type: "text", "fielddata": true},
                            dateBorn: {type: "date"},
                            rol: {type: "text", "fielddata": true},
                            index: {type: "integer", "doc_values": true},
                            bio: {type: "text", "doc_values": true},
                            skills: {
                                type: "nested",
                                properties: {
                                    name: {type: "text"},
                                    level: {type: "keyword"},
                                },
                            },
                            languages: {
                                type: "nested",
                                properties: {
                                    language: {type: "text"},
                                    level: {type: "keyword"},
                                },
                            },
                            educations: {
                                type: "nested",
                                properties: {
                                    title: {type: "text"},
                                    institution: {type: "text"},
                                    dateStart: {type: "date"},
                                    dateEnd: {type: "date"},
                                },
                            },
                            experiences: {
                                type: "nested",
                                properties: {
                                    title: {type: "text"},
                                    dateStart: {type: "date"},
                                    dateEnd: {type: "date"},
                                },
                            },
                        },
                    },
                },
            },
        })
    }
});

client.indices.exists({
    index: 'offerers'
}).then(function (exists) {
    if (!exists) {
        client.indices.create({
            index: "offerers",
            body: {
                mappings: {
                    offerer: {
                        properties: {
                            name: {type: "text", "fielddata": true},
                            email: {type: "text"},
                            status: {type: "integer", "doc_values": true},
                            address: {type: "text", "fielddata": true},
                            bio: {type: "text", "fielddata": true},
                            index: {type: "integer", "doc_values": true},
                            companySize: {type: "integer", "doc_values": true},
                            workField: {type: "text", "fielddata": true},
                            year: {type: "integer", "doc_values": true},
                            dateVerification: {type: "date", "doc_values": true},
                        },
                    },
                },
            },
        })
    }
});

client.indices.exists({
    index: 'logs'
}).then(function (exists) {
    if (!exists) {
        client.indices.create({
            index: "logs",
            body: {
                mappings: {
                    log: {
                        properties: {
                            action: {type: "text", "fielddata": true},
                            actionToRoute: {type: "text", "fielddata": true},
                            date: {type: "date", "doc_values": true},
                            hour: {type: "date", "format": "HH:mm:ss", "doc_values": true},
                            status: {type: "boolean", "doc_values": true},
                        },
                    },
                },
            },
        })
    }
});

client.indices.exists({
    index: 'offers'
}).then(function (exists) {
    if (!exists) {
        client.indices.create({
            index: "offers",
            body: {
                mappings: {
                    offer: {
                        properties: {
                            status: {type: "text", "fielddata": true},
                            title: {type: "text", "fielddata": true},
                            location: {type: "text", "fielddata": true},
                            createdAt: {type: "date", "doc_values": true},
                            dateStart: {type: "date", "doc_values": true},
                            dateEnd: {type: "date", "doc_values": true},
                            datePublished: {type: "date", "doc_values": true},
                            offererName: {type: "text", "fielddata": true},
                            offererIndex: {type: "integer", "doc_values": true},
                            salaryAmount: {type: "integer", "doc_values": true},
                            seniority: {type: "text", "fielddata": true},
                            contractType: {type: "text", "fielddata": true},
                            salaryCurrency: {type: "text", "fielddata": true},
                            description: {type: "text"},
                            skills: {type: "text", "fielddata": true},
                            workLocation: {type: "text", "fielddata": true},
                        },
                    },
                },
            },
        })
    }
});

client.cluster.health({}, function (err, resp, status) {
//     // console.log("-- Client Health --",resp);
});

module.exports = client;
