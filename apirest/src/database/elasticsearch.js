var elasticsearch = require('elasticsearch');
const env = require('../tools/constants');

var client = new elasticsearch.Client({  
  //If you want to use this configuration on production server, just uncomment the commented part and comment 
    host: env.ES_URL,
    log: 'trace'

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
							name: { type: "text" },
							email: { type: "text" },
							city: { type: "text" },
							dateBorn: { type: "date" },
							premium: { type: "integer" },
							rol: { type: "integer" },
							index: { type: "integer" },
							bio: { type: "text" },
							skills: {
								type: "nested",
								properties: {
									name: { type: "keyword" },
									level: { type: "keyword"},
								},
							},
							languages: {
								type: "nested",
								properties: {
									language: { type: "keyword" },
									level: { type: "keyword"},
								},
							},
							educations: {
								type: "nested",
								properties: {
									title: { type: "keyword" },
									institution: { type: "text" },
									dateStart: { type: "date" },
									dateEnd: { type: "date" },
								},
							},
							experiences: {
								type: "nested",
								properties: {
									title: { type: "keyword" },
									dateStart: { type: "date" },
									dateEnd: { type: "date" },
								},
							},
						},
					},
				},
			},
		})
  	} 
});


client.cluster.health({},function(err,resp,status) {  
//     // console.log("-- Client Health --",resp);
  });

module.exports = client;