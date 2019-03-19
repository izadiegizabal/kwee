const constants = {};

constants.ENVIRONMENT =  'LOCAL'; // LOCAL, PROD OR DEV

constants.URL = constants.ENVIRONMENT=='LOCAL'?'http://localhost:4200':constants.ENVIRONMENT=='DEV'?'http://h203.eps.ua.es':'https://www.kwee.ovh';


export {
    constants
}
