const authRouter = require('./auth')
const usersRouter = require('./users')
const servicesRouter = require('./services')
const devRouter = require('./dev')

module.exports = (app) => {
    app.use('/api/auth', authRouter)
    app.use('/api/users', usersRouter)
    app.use('/api/services', servicesRouter)
    app.use('/api/dev', devRouter)
}