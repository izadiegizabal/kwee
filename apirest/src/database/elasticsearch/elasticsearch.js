var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({  
    host: 'localhost:9200',
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