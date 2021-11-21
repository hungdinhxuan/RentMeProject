const authRouter = require('./auth');
const usersRouter = require('./users');
const servicesRouter = require('./services');
const devRouter = require('./dev');
const playersRouter = require('./players');
const filesRouter = require('./files');
const tradingsRouter = require('./tradings')
const managemnentsRouter = require('./managements');
const conversationsRouter = require('./conversations')
const createError = require('http-errors')

module.exports = (app) => {
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/dev', devRouter);
  app.use('/api/players', playersRouter);
  app.use('/api/files', filesRouter);
  app.use('/api/tradings', tradingsRouter)
  app.use('/api/managements', managemnentsRouter)
  app.use('/api/conversations', conversationsRouter)
  app.use((req, res, next) => {
    next(createError(404, "Not found!"));
  })
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
      error: err.message,
    });
  })
};
