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
  const Message = require('../models/messages.models');
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: '*', path: '/mysocket' });
  const jwt = require('jsonwebtoken');
  const fs = require('fs');
  const publicKey = fs.readFileSync('public.pem');
  const Trading = require('../models/tradings.models');

  // const wrap = (middleware) => (socket, next) =>
  //   middleware(socket.request, {}, next);
  // io.use(wrap(passport.initialize()));
  // io.use(wrap(passport.session()));
  // io.use(wrap(passport.authenticate('jwt')));

  // Store online user in {} ex: {username1: Set(socket1, socket2)}

  let userPeers = []; // Using for video call

  io.on('connection', (socket) => {
    socket.auth = false;

    socket.on('authenticate', function (token) {
      //
      // check data được send tới client
      jwt.verify(token, publicKey, async (err, data) => {
        if (err) {
          socket.auth = false;
        } else {
          // console.log(data);
          const { sub } = data;
          const user = await User.findById(sub);

          socket.auth = true;
          socket.username = user.username;
          socket.role = user.role;
          addClientToObj(socket.username, socket.id, socket.role, io);
        }
      });
    });

    socket.on('logout', () => {
      if (socket.auth) {
        socket.auth = false;
        removeClientFromObj(
          socket.username,
          socket.id,
          socket.role,
          io,
          'logout',
        );
      }
    });

    socket.on('disconnect', (reason) => {
      // console.log(`${socket.id} disconnected with ${reason}`);
      removeClientFromObj(socket.username, socket.id, socket.role, io);
      socket.auth = false;
    });

    socket.on('rent player', async (data) => {
      if (socket.auth) {
        const { renterId, playerId, money, time } = data;

        try {
          const player = await User.findById(playerId);
          const renter = await User.findOne({ username: socket.username });
          const tradings = await Trading.find({
            renterId: renter._id,
            playerId: player._id,
          });

          if (!player) {
            socket.emit('response renter', 'this user does not exist');
          } else if (player.status === 'busy') {
            socket.emit(
              'response renter',
              'this player is rent by another user',
            );
          } else if (!player.isOnline) {
            socket.emit('response renter', 'this player is offline');
          } else {
            // Kiem tra xem renter da gui request den cho player truoc do hay chua
            for (let trading of tradings) {
              
              if (trading.status === 'pending') {
                let expireTradingDate = new Date(trading.createdAt);
                expireTradingDate.setMinutes(
                  expireTradingDate.getMinutes() + trading.expireIn,
                );

                if (expireTradingDate.getTime() < new Date().getTime()) {
                  /// Da het han roi ma van pending
                  await Trading.findByIdAndDelete(trading._id);
                } else {
                  // Van con han su dung nhung ma renter van click rent
                  const timeRemain = parseInt(
                    (Math.abs(
                    new Date().getTime() -
                        new Date(trading.createdAt).getTime(),
                    ) /
                      (1000 * 60)) %
                      60,
                  );
                  socket.emit(
                    'response error renter',
                    `You have already requested to this player !!! Please try in ${timeRemain} minutes`,
                  );
                  
                  return;
                } 
              }
              else if(trading.status === 'performing') {
                socket.emit(
                  'response error renter',
                  `This player is in another trasaction`,
                );
              }
            }

            const trading = await Trading.create({
              renterId,
              playerId,
              money,
              time,
              status: 'pending',
              // Tao strong password with 8 characters
              roomId: Math.random().toString(36).slice(-8),
              roomPassword: Math.random().toString(36).slice(-8),
            });

            const system = await User.findOne({ username: 'system' });
            const msgForRenter = await Message.create({
              senderId: system._id,
              receiverId: renterId,
              content: `You sent a request to ${player.fullName} successful !!`,
            });
            const msgForPlayer = await Message.create({
              senderId: system._id,
              receiverId: playerId,
              content: `${renter.fullName}(${renter._id}) wish to rent you within ${time} hours with ${money}$. Current trading ID: ${trading._id}`,
            });

            // response to all current socket of renter
            if (userSocketIdObj[socket.username]) {
              for (let socketId of userSocketIdObj[socket.username]) {
                io.to(socketId).emit('response renter', msgForRenter);
              }
            }
            // response to all current socket of player
            if (userSocketIdObj[player.username]) {
              for (let socketId of userSocketIdObj[player.username]) {
                io.to(socketId).emit('response player', msgForPlayer);
              }
            }
          }
        } catch (error) {
          console.log(
            '🚀 ~ file: socket.js ~ line 123 ~ socket.on ~ error',
            error,
          );
        }
      }
    });
    socket.on('decline rent', async (data) => {
      if (socket.auth) {
        const { content, _id, receiverId } = data; // data is message from system sent to player
        const tradingId = content.split(' Current trading ID: ')[1];
        try {
          const sender = await User.findById(content.match(/\(([^)]+)\)/)[1]); // get id value in round bracket
          const player = await User.findById(receiverId);
          await Message.findByIdAndDelete(_id);
          await Trading.findByIdAndDelete(tradingId);

          if (userSocketIdObj[socket.username]) {
            // Tra ve cho player

            for (let socketId of userSocketIdObj[socket.username]) {
              io.to(socketId).emit('response decline rent', {
                message: `You declined request from ${sender.fullName}`,
                msgId: _id,
              });
            }
          }

          if (userSocketIdObj[sender.username]) {
            // Tra ve cho renter

            for (let socketId of userSocketIdObj[sender.username]) {
              io.to(socketId).emit('response decline rent', {
                message: `Your request are declined by ${player.fullName}`,
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
    socket.on('confirm rent', async (data) => {
      if (socket.auth) {
        const { content, receiverId, _id } = data;
        try {
          const tradingId = content.split(' Current trading ID: ')[1];
          const trading = await Trading.findByIdAndUpdate(
            tradingId,
            { status: 'performing'},
            { new: true },
          );
          const renter = await User.findById(trading.renterId);
          const system = await User.findOne({ username: 'system' });
          const updatedMessage = await Message.findByIdAndUpdate(_id, {content:  content.split(' Current trading ID: ')[0]}, {new: true})
          if (trading) {
            const msgForRenter = await Message.create({
              senderId: system._id,
              receiverId: renter._id,
              content: `Trading ${tradingId} accepted by ${socket.username}.\n Room ID: ${trading.roomId}, Room Password: ${trading.roomPassword}`,
            });
            const msgForPlayer = await Message.create({
              senderId: system._id,
              receiverId: receiverId,
              content: `You are accepted ${tradingId} with ${renter.username}.\n Room ID: ${trading.roomId}, Room Password: ${trading.roomPassword}`,
            });
            if (userSocketIdObj[socket.username]) {
              for (let socketId of userSocketIdObj[socket.username]) {
                io.to(socketId).emit('response confirm rent', {message: msgForPlayer, updatedMessage});
              }
            }

            if (userSocketIdObj[renter.username]) {
              for (let socketId of userSocketIdObj[renter.username]) {
                io.to(socketId).emit('response confirm rent', {message: msgForRenter});
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  });

  // io.on('connection', async (socket) => {

  //   socket.username = socket.request.session.passport.user.username;
  //   socket.role = socket.request.session.passport.user.role;

  //   addClientToObj(socket.username, socket.id, socket.role, io);
  //   // console.log(socket.id);

  //   socket.on('disconnect', async () => {
  //     // console.log(socket.userId + ' is ' + socket.userStatus);
  //     removeClientFromObj(socket.username, socket.id, socket.role, io);
  //     const user = userLeave(socket.id);
  //     if (user) {
  //       socket.broadcast.to(user.room).emit('message', {
  //         name: 'Admin',
  //         msg: `${user.name} has left to room`,
  //       });

  //       let allMembersInRoom = users
  //         .filter((_user) => _user.room === user.room)
  //         .map((user) => user.peerID);
  //       io.to(user.room).emit('allMembers', allMembersInRoom);
  //     }

  //     userPeers = userPeers.filter((id) => id !== socket.peerID);

  //     if (socket.client.conn.server.clientsCount == 0) {
  //       userPeers = [];
  //     }
  //   });

  //   socket.on('logout', () => {
  //     removeClientFromObj(socket.username, socket.id, socket.role, io, 'logout');
  //   })

  //   // socket.on('chat message', (recipientUserName, messageContent) => {
  //   //   //get all clients (socketIds) of recipient
  //   //   let recipientSocketIds = userSocketIdObj.get(recipientUserName);
  //   //   for (let socketId of recipientSocketIds) {
  //   //     io.to(socketId).emit('new message', messageContent);
  //   //   }
  //   // });
  //   socket.on('joinRoom', ({ name, room, peerID }) => {
  //     const user = userJoin({ id: socket.id, name, room, peerID });
  //     if (peerID) userPeers.push(peerID);
  //     socket.join(user.room);
  //     socket.peerID = peerID;

  //     // Wellcome room
  //     socket.emit('message', { name: 'Admin', msg: 'Wellcome to chat app' });

  //     let allMembersInRoom = users
  //       .filter((user) => user.room === room)
  //       .map((user) => user.peerID);

  //     io.to(room).emit('allMembers', allMembersInRoom);

  //     socket.broadcast.to(user.room).emit('message', {
  //       name: 'Admin',
  //       msg: `${name} has joined to room`,
  //     });
  //   });

  //   socket.on('sendMessage', ({ name, msg, room }) => {
  //     io.to(room).emit('message', {
  //       name,
  //       msg,
  //     });
  //   });

  //   socket.on('peerClose', ({ peerId }) => {
  //     if (peerId) {
  //       userPeers = userPeers.filter((id) => id !== peerId);
  //       socket.peerID = null;
  //       let user = userLeave(socket.id);

  //       if (user) {
  //         socket.broadcast.to(user.room).emit('message', {
  //           name: 'Admin',
  //           msg: `${user.name} has left to room`,
  //         });

  //         let allMembersInRoom = users
  //           .filter((_user) => _user.room === user.room)
  //           .map((user) => user.peerID);
  //         io.to(user.room).emit('allMembers', allMembersInRoom);
  //       }
  //     }
  //   });

  //   socket.on('getPeers', ({ room }) => {
  //     console.log(room);
  //     let peers = users
  //       .filter((user) => user.room === room)
  //       .map((user) => user.peerId);

  //     io.to(room).emit('sendPeers', peers);
  //   });
  // });

  httpServer.listen(4000);
};
