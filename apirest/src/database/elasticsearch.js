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

client.cluster.health({},function(err,resp,status) {  
    // console.log("-- Client Health --",resp);
  });

module.exports = client;