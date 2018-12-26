const pass = require('./passwords');

const callback_url = 'http://localhost:5000/auth/';
// const callback_url = 'https://kwee.ovh/api/auth/';
let PROD = pass.PROD;

const env = {

    PROD,

    DATABASE_NAME: PROD ? 'kwee' : 'kweetest',
    DATABASE_USERNAME: 'root',
    DATABASE_PASSWORD: PROD ? pass.MYSQL_PASSWORD : '',
    PORT: PROD ? 5000 : 3000,

    JSONWEBTOKEN_SECRET: pass.JSONWEBTOKEN_SECRET,
    JSONWEBTOKEN_ISSUER: pass.JSONWEBTOKEN_ISSUER,
    JSONWEBTOKEN_EXPIRES: '88888h',
    // sería bueno que caducara por sesión y si el usuario sigue logueado hacer un proceso de renovación automática de token
    SESSION_SECRET: pass.SESSION_SECRET,
    LOGIN_MASTER_PASSWORD: pass.LOGIN_MASTER_PASSWORD,

    // Gmail
    EMAIL: pass.EMAIL,
    EMAIL_PASSWORD: pass.EMAIL_PASSWORD,
    message: {
        from: pass.EMAIL,
        to: 'carlosaldaravi@gmail.com',
        subject: 'Prueba de verificación',
        text: 'Plaintext version of the message',
        html: '<p>HTML version of the message</p>'
    },

    //Instagram API
    INSTAGRAM_ID: pass.INSTAGRAM_ID,
    INSTAGRAM_SECRET: pass.INSTAGRAM_SECRET,
    INSTAGRAM_URL: callback_url + 'instagram/callback',

    // LinkEdin API
    LINKEDIN_ID: pass.LINKEDIN_ID,
    LINKEDIN_SECRET: pass.LINKEDIN_SECRET,
    LINKEDIN_URL: callback_url + 'linkedin/callback',

    // Twitter API
    TWITTER_ID: pass.TWITTER_ID,
    TWITTER_SECRET: pass.TWITTER_SECRET,
    TWITTER_TOKEN: pass.TWITTER_TOKEN,
    TWITTER_TOKEN_SECRET: pass.TWITTER_TOKEN_SECRET,
    TWITTER_URL: callback_url + 'twitter/callback',

    // Telegram API
    TELEGRAM_ID: pass.TELEGRAM_ID,
    TELEGRAM_SECRET: pass.TELEGRAM_SECRET,
    TELEGRAM_URL: callback_url + 'telegram/callback',

    // Google API
    CLIENT_ID: pass.GOOGLE_ID,

    // GitHub API
    GITHUB_ID: pass.GITHUB_ID,
    GITHUB_SECRET: pass.GITHUB_SECRET,
    GITHUB_URL: callback_url + 'github/callback',
};

module.exports = env;