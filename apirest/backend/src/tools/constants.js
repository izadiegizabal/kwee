const pass = require('./passwords');

const env = {
    DATABASE_NAME: 'simple',
    DATABASE_USERNAME: 'root',
    DATABASE_PASSWORD: '',
    PORT: 3000,

    JSONWEBTOKEN_SECRET: pass.JSONWEBTOKEN_SECRET,
    JSONWEBTOKEN_ISSUER: pass.JSONWEBTOKEN_ISSUER,
    JSONWEBTOKEN_EXPIRES: "88888h",

    LOGIN_MASTER_PASSWORD: pass.LOGIN_MASTER_PASSWORD,

    //Instagram API
    INSTAGRAM_ID: pass.INSTAGRAM_ID,
    INSTAGRAM_SECRET: pass.INSTAGRAM_SECRET,

    // LinkEdin API
    LINKEDIN_ID: pass.LINKEDIN_ID,
    LINKEDIN_SECRET: pass.LINKEDIN_SECRET,

    // Twitter API

    // Telegram API
    TELEGRAM_ID: pass.TELEGRAM_ID,
    TELEGRAM_SECRET: pass.TELEGRAM_SECRET,

    // Google API
    CLIENT_ID: pass.GOOGLE_ID
};
module.exports = env;