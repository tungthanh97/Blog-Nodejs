const { default: mongoose } = require('mongoose')
const app = require('./src/app')

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Handle server shutdown on Ctrl+C
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server has been disconnected')
        mongoose.connection.close(true).then(() => {
            console.log('Connection disconnected')
        })
    })
})
