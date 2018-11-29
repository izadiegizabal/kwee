const pass = require('./passwords');

// const callback_url = 'http://localhost:3000/auth/';
const callback_url = 'http://kwee.ovh/api/auth/';

const env = {
    DATABASE_NAME: 'kweetest',
    DATABASE_USERNAME: 'root',
    DATABASE_PASSWORD: '',
    PORT: 3000,

    JSONWEBTOKEN_SECRET: pass.JSONWEBTOKEN_SECRET,
    JSONWEBTOKEN_ISSUER: pass.JSONWEBTOKEN_ISSUER,
    JSONWEBTOKEN_EXPIRES: '88888h',

    SESSION_SECRET: pass.SESSION_SECRET,
    LOGIN_MASTER_PASSWORD: pass.LOGIN_MASTER_PASSWORD,

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