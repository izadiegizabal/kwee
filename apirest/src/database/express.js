const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    session = require('express-session'),
    env = require('../tools/constants'),
    moment = require('moment'),
    logger = require('../middlewares/logger')
    cors = require('cors');

const app = express();

app.use(logger);
// Configure the app to use bodyParser()
// This will let us get the data from post
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '15mb' }));

app.use((req, res, next) => {
    // res.writeHead(200, { 'Content-Type': 'text/html' });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DETELE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
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