const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    session = require('express-session');

const app = express();

// Configure the app to use bodyParser()
// This will let us get the data from post
app.use(bodyParser.urlencoded({ extended: true }));
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
    secret: 'sytr456-65tyrd-12wrt',
    resave: true,
    saveUninitialized: true
}));

// enable frontend folder
app.use(express.static(path.resolve(__dirname, '../../../frontend')));

module.exports = app;