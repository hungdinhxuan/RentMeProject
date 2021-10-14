module.exports = (app) => {
  const { createServer } = require('http');
  const { Server } = require('socket.io');
  const User = require('../models/users.models');
  const {
    userSocketIdObj,
    addClientToObj,
    removeClientFromObj,
  } = require('./client');
  const { userJoin, getUser, userLeave, users } = require('./usersMeet');
  const passport = require('passport');
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: '*', path: '/mysocket' });


  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use(wrap(passport.authenticate('jwt')));

  // Store online user in {} ex: {username1: Set(socket1, socket2)}

  let userPeers = []; // Using for video call

  io.on('connection', async (socket) => {

    console.log('hello!', socket.request.session.passport.user);
    socket.username = socket.request.session.passport.user.username;
    socket.role = socket.request.session.passport.user.role;
    
    addClientToObj(socket.username, socket.id, socket.role, io);
    // console.log(socket.id);

    socket.on('disconnect', async () => {
      // console.log(socket.userId + ' is ' + socket.userStatus);
      removeClientFromObj(socket.username, socket.id, socket.role, io);
      const user = userLeave(socket.id);
      if (user) {
        socket.broadcast.to(user.room).emit('message', {
          name: 'Admin',
          msg: `${user.name} has left to room`,
        });

        let allMembersInRoom = users
          .filter((_user) => _user.room === user.room)
          .map((user) => user.peerID);
        io.to(user.room).emit('allMembers', allMembersInRoom);
      }

      userPeers = userPeers.filter((id) => id !== socket.peerID);

      if (socket.client.conn.server.clientsCount == 0) {
        userPeers = [];
      }
    });

    socket.on('logout', () => {
      removeClientFromObj(socket.username, socket.id, socket.role, io, 'logout');
    })
  
    // socket.on('chat message', (recipientUserName, messageContent) => {
    //   //get all clients (socketIds) of recipient
    //   let recipientSocketIds = userSocketIdObj.get(recipientUserName);
    //   for (let socketId of recipientSocketIds) {
    //     io.to(socketId).emit('new message', messageContent);
    //   }
    // });
    socket.on('joinRoom', ({ name, room, peerID }) => {
      const user = userJoin({ id: socket.id, name, room, peerID });
      if (peerID) userPeers.push(peerID);
      socket.join(user.room);
      socket.peerID = peerID;

      // Wellcome room
      socket.emit('message', { name: 'Admin', msg: 'Wellcome to chat app' });

      let allMembersInRoom = users
        .filter((user) => user.room === room)
        .map((user) => user.peerID);

      io.to(room).emit('allMembers', allMembersInRoom);

      socket.broadcast.to(user.room).emit('message', {
        name: 'Admin',
        msg: `${name} has joined to room`,
      });
    });

    socket.on('sendMessage', ({ name, msg, room }) => {
      io.to(room).emit('message', {
        name,
        msg,
      });
    });

    socket.on('peerClose', ({ peerId }) => {
      if (peerId) {
        userPeers = userPeers.filter((id) => id !== peerId);
        socket.peerID = null;
        let user = userLeave(socket.id);

        if (user) {
          socket.broadcast.to(user.room).emit('message', {
            name: 'Admin',
            msg: `${user.name} has left to room`,
          });

          let allMembersInRoom = users
            .filter((_user) => _user.room === user.room)
            .map((user) => user.peerID);
          io.to(user.room).emit('allMembers', allMembersInRoom);
        }
      }
    });

    socket.on('getPeers', ({ room }) => {
      console.log(room);
      let peers = users
        .filter((user) => user.room === room)
        .map((user) => user.peerId);

      io.to(room).emit('sendPeers', peers);
    });
  });

  httpServer.listen(4000);
};
