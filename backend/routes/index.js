const authRouter = require('./auth')
const usersRouter = require('./users')

module.exports = (app) => {
    app.use('/api/auth', authRouter)
    app.use('/api/users', usersRouter)
}