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
app.use((req, res, next) => {
    const error = new Error('Resource not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
    })
})


module.exports = app;