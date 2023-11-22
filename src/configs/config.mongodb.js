'use strict'

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        // host: process.env.DB_HOST || 'localhost',
        // port: process.env.DB_PORT || 27017,
        // name: process.env.DB_BANE || 'blogTom',
        uri:
            process.env.DB_URI ||
            'mongodb+srv://ichigofan:ichigo100@mern.k0s8y.mongodb.net/',
    },
}

module.exports = config
