
const constants = {};

constants.ENVIRONMENT = window.location.hostname;

constants.URL = constants.ENVIRONMENT==='localhost'?'http://localhost:4200':constants.ENVIRONMENT==='h203.eps.ua.es'?'http://h203.eps.ua.es':'https://www.kwee.ovh';

export {
    constants
}
