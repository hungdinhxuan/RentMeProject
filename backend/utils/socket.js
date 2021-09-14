module.exports = (app) => {
    const server = require('http').createServer(app)
    const io = require('socket.io')(server)
    io.on('connection', (socket) => {
        socket.on('disconnect', async () => {
            console.log('user disconnected')
        })
    })
}