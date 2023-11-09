const express = require('express');
const morgan = require('morgan');
const {default: helmet} = require('helmet');
// const compression = require('compression');
const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
// app.use(compression())

// init db
require('./dbs/init.mongodb')
// init routers
app.use('/', require('./routes'))
// handle errors

module.exports = app;