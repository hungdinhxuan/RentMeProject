const authRouter = require('./auth');
const usersRouter = require('./users');
const servicesRouter = require('./services');
const devRouter = require('./dev');
const playersRouter = require('./players');
const filesRouter = require('./files');
const tradingsRouter = require('./tradings')
const managemnentsRouter = require('./managements');

module.exports = (app) => {
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/dev', devRouter);
  app.use('/api/players', playersRouter);
  app.use('/api/files', filesRouter);
  app.use('/api/tradings', tradingsRouter)
  app.use('/api/managements', managemnentsRouter)
};
