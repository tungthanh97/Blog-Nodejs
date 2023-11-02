'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// Count connect
const countConnect = () => {
    return mongoose.connections.length
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024
        // Example maximum number of connections base on number of cores
        console.log('Memory usage: ', memoryUsage, 'MB')
        const maxConnections = numCores * 5
        if (numConnection > maxConnections) {
            console.log('Connection overload')
        }
    }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload,
}
