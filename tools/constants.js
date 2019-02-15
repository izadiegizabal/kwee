class constants{
    
    ENVIRONMENT = "LOCAL"
    URL = '';

}

function check() {
    console.log("Running on " + ENVIRONMENT);
    switch(ENVIRONMENT){
        case 'LOCAL': {
            URL = 'localhost/';
            break;
        }
        case 'DEVELOPMENT': {
            URL = 'http://h203.eps.ua.es/'
            break;
        }
        case 'PRODUCTION': {
            URL = 'https://www.kwee.ovh/'
            break;
        }

    }
}

export { 
    constants,
    check
}
