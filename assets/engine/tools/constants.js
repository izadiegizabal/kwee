export const constants = {
    ENVIRONMENT: 'LOCAL',
    URL: '',

}


export default function check() {
    console.log("Running on " + ENVIRONMENT);
    switch (ENVIRONMENT) {
        case 'LOCAL': {
            constants.URL = 'localhost/';
            break;
        }
        case 'DEVELOPMENT': {
            constants.URL = 'http://h203.eps.ua.es/'
            break;
        }
        case 'PRODUCTION': {
            constants.URL = 'https://www.kwee.ovh/'
            break;
        }
    }
}

exports = {
    constants,
    check
}
