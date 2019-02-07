const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    session = require('express-session'),
    env = require('../tools/constants'),
    moment = require('moment'),
    logger = require('../middlewares/logger');

const app = express();

app.use(logger);
// Configure the app to use bodyParser()
// This will let us get the data from post
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
  }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header('Content-Type', 'application/json');

    next();
});

// express-session setup 
app.use(session({
    secret: env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// enable frontend folder
app.use(express.static(path.resolve(__dirname, '../../../frontend')));

module.exports = app;