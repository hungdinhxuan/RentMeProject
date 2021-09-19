const authRouter = require('./auth')
const usersRouter = require('./users')
const servicesRouter = require('./services')

module.exports = (app) => {
    app.use('/api/auth', authRouter)
    app.use('/api/users', usersRouter)
    app.use('/api/services', servicesRouter)
}