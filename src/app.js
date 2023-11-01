const express = require('express');
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression)

// init db
app.get('/', (req, res) => {
   return res.status(200).json({message:'Hello World!'});
});

// init routers

// handle errors

module.exports = app;