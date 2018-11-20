const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express()

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

// enable frontend folder
app.use(express.static(path.resolve(__dirname, '../../../frontend')));

module.exports = app;