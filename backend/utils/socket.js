module.exports = (app) => {
  const { createServer } = require('http');
  const { Server } = require('socket.io');
  
  const passport = require('passport')
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: '*', path: '/mysocket' });
  // console.log(passport);
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use(wrap(passport.authenticate('jwt')));

  io.on('connection', (socket) => {
    console.log('hello!', socket.id);

    socket.on('disconnect', () => {});
  });

  httpServer.listen(4000);
};
