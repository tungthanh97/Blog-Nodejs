'use strict'

const mongoose = require('mongoose')
const {
    db: { uri },
} = require('../configs/config.mongodb')

// const connectionStr = `mongodb://${host}:${port}/${name}`
const connectionStr = uri

console.log('connectionStr', connectionStr)

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose
            .connect(connectionStr)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch((err) => {
                console.error('Database connection error', err)
            })
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
