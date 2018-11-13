const express = require('express')
const bodyParser = require('body-parser')


const app = express()
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});

module.exports = app;