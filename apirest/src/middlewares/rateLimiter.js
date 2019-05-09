const rateLimit = require("express-rate-limit");
const { app } = require('../database/express');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
   
  //  apply to all requests

const createAccountLimiter = rateLimit({
windowMs: 60 * 60 * 1000, // 1 hour window
max: 5, // start blocking after 5 requests
message:
    "Too many accounts created from this IP, please try again after an hour"
});

// use this when no need to use the script
// app.use(limiter);

module.exports = {
    limiter,
    createAccountLimiter
}