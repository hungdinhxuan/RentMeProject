const path = require('path');

module.exports = (app) => {
  const { createServer } = require('http');
  const { Server } = require('socket.io');
  const User = require('../models/users.model');
  const {
    userSocketIdObj,
    addClientToObj,
    removeClientFromObj,
  } = require('./client');
  const Message = require('../models/messages.model');
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: '*', path: '/mysocket' });
  const jwt = require('jsonwebtoken');
  const fs = require('fs');
  const publicKey = fs.readFileSync('public.pem');
  const Trading = require('../models/tradings.model');
  const Transfer = require('../models/transfers.model')
  const PlayerProfile = require('../models/player_profiles.model')
  const xss = require('xss');
  const sanitizeString = (str) => {
    return xss(str);
  };
  // const wrap = (middleware) => (socket, next) =>
  //   middleware(socket.request, {}, next);
  // io.use(wrap(passport.initialize()));
  // io.use(wrap(passport.session()));
  // io.use(wrap(passport.authenticate('jwt')));

  // Store online user in {} ex: {username1: Set(socket1, socket2)}

  let connections = {}; /// Lưu trữ thông tin phòng và tất cả các socket id trong room đó {room1: [socket.id], roomn : [socket.id]}
  let messages = {};
  let timeOnline = {};



  /// [room1: set(user1: set(socket id ) ), room2: set(user2: set(socket id ) ), ]
  let connectionsStreamhub = {}
  let messagesStreamhub = {}

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

    // runing per 20p to check if status is pending then emit to user and remove 
    setInterval(async () => {
      const tradings = await Trading.find().lean()
      let expireTradingDate 
      
      tradings.forEach(async (trading, index) => {

        if(trading.status === 'pending'){

          expireTradingDate = new Date(trading.createdAt);
          expireTradingDate.setMinutes(
            expireTradingDate.getMinutes() + trading.expireIn,
          );
          // Het han roi ma van pending
          if(expireTradingDate.getTime() < new Date().getTime()){
            try {
              await Trading.findByIdAndDelete(trading._id)
              const player = await User.findById(trading.playerId)
              const renter = await User.findById(trading.renterId)
              if(userSocketIdObj[renter.username]){
                for(let socketId of userSocketIdObj[renter.username]){
                    console.log('emitted because expire');
                    io.to(socketId).emit('expire rent player',`Your trading between you and ${player.fullName} is automatically removed because time is expired` )
                }
              }
            } catch (error) {
              console.log("🚀 ~ file: socket.js ~ line 75 ~ tradings.forEach ~ error", error)
            }
          }
        }
      })
    }, 20 * 60 * 1000) 

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
      //

      // var diffTime = Math.abs(timeOnline[socket.id] - new Date());
      // var key;
      for (const [key, val] of Object.entries(connections)) {
        for (let socketId of val) {
          // Kiem tra xem socketId do thuoc room nao
          if (socketId === socket.id) {
            // neu tim thay thi thong bao den tat cac cac socket con lai trogn room
            for (let socketId2 of val) {
              io.to(socketId2).emit('user-left', socket.id);
            }
            connections[key].delete(socket.id); // delete connections ra khoir room
            if (connections[key].size === 0) {
              /// Neu khong con ket noi nao nua thi xoa room
              delete connections[key];
              delete messages[key];
            }
            break;
          }
        }
      }

      
      // Streamhub 
      for (const [path, setUsers] of Object.entries(connectionsStreamhub)) {
        for(let user of setUsers){

          //delete socket id out of user
          if(connectionsStreamhub[path][user]){
            connectionsStreamhub[path][user].delete(socket.id)
            if(connectionsStreamhub[path][user].size === 0){
              delete connectionsStreamhub[path][user]
            }
          }
          // if no user in room then delete room
          if(connectionsStreamhub[path].size === 0){
            delete connectionsStreamhub[path]
            delete messagesStreamhub[path]
          }

        }
      }
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
              } else if (trading.status === 'performing') {
                socket.emit(
                  'response error renter',
                  `This player is in another trasaction`,
                );
                return;
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
        let trading
        const { content, receiverId, _id } = data;
        try {
          const tradingId = content.split(' Current trading ID: ')[1];
          trading = await Trading.findById(tradingId)
          if(!trading){ /// Trading is not exist anymore
            await Message.findByIdAndDelete(_id)
            socket.emit('error trading', 'Trading is removed by system because overcome time')
            return
          }
          trading = await Trading.findByIdAndUpdate(
            tradingId,
            { status: 'performing' },
            { new: true },
          );
          const renter = await User.findById(trading.renterId);
          const player = await User.findOne({username: socket.username})
          await new Transfer({
            sender: renter._id,
            receiver: player._id,
            money: trading.money,
            type: "trade",
            tradingId: trading._id
          }).save()
          const system = await User.findOne({ username: 'system' });
          const updatedMessage = await Message.findByIdAndUpdate(
            _id,
            { content: content.split(' Current trading ID: ')[0] },
            { new: true },
          );

          if (trading) {
            let expireTradingDate = new Date(trading.createdAt);
            expireTradingDate.setMinutes(
              expireTradingDate.getMinutes() + trading.expireIn,
            );

            if(expireTradingDate.getTime() < new Date().getTime()){
              socket.emit('trading error', 'Trading expired and removed')
              await Trading.findByIdAndDelete(tradingId)
               return               
            }
            const msgForRenter = await Message.create({
              senderId: system._id,
              receiverId: renter._id,
              content: `Trading ${tradingId} accepted by ${socket.fullName}.\n Room ID: ${trading.roomId}, Room Password: ${trading.roomPassword}`,
            });
            const msgForPlayer = await Message.create({
              senderId: system._id,
              receiverId: receiverId,
              content: `You are accepted ${tradingId} with ${renter.fullName}.\n Room ID: ${trading.roomId}, Room Password: ${trading.roomPassword}`,
            });
            if (userSocketIdObj[socket.username]) {
              for (let socketId of userSocketIdObj[socket.username]) {
                io.to(socketId).emit('response confirm rent', {
                  message: msgForPlayer,
                  updatedMessage,
                });
              }
            }

            if (userSocketIdObj[renter.username]) {
              for (let socketId of userSocketIdObj[renter.username]) {
                io.to(socketId).emit('response confirm rent', {
                  message: msgForRenter,
                });
              }
            }
          }
        } catch (error) {
          console.log(
            '🚀 ~ file: socket.js ~ line 272 ~ socket.on ~ error',
            error,
          );
        }
      }
    });

    socket.on('join-call', (path) => {
      if (connections[path] === undefined) {
        connections[path] = new Set([]);
      }
      connections[path].add(socket.id);

      // Join room
      socket.join(path);

      timeOnline[socket.id] = new Date();

      // Duyệt qua tất cả các kết nối của room hiện tại rồi emit đến tất cả các socket trong room

      // for(let socketId of connections[path]){
      // console.log("🚀 ~ file: socket.js ~ line 290 ~ socket.on ~ connections[path]", connections[path])

      //   io.to(socketId).emit(
      //     "user-joined",
      //     socket.id,
      //     Array.from(connections[path])
      //   );
      // }

      io.to(path).emit('user-joined', socket.id, Array.from(connections[path]));

      /// Nếu mà  có message trong room hiện tại thì gửi về cho tất cả các socket ở trong room
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            'chat-message',
            messages[path][a]['data'],
            messages[path][a]['sender'],
            messages[path][a]['socket-id-sender'],
          );
        }
      }

      console.log(path, connections[path]);
    });

    socket.on('signal', (toId, message) => {
      io.to(toId).emit('signal', socket.id, message);
    });

    socket.on('chat-message', (data, sender) => {
      if (socket.auth) {
        data = sanitizeString(data);
        sender = sanitizeString(sender);
        console.log(`${sender}: ${data}`);
        var key;
        var ok = false;

        /// for Duyệt qua các phòng và array socketId của phòng đó để tìm xem socketId đang ở phòng naò dựa vào key và ok===true
        // for (const [k, v] of Object.entries(connections)) {
        //   for (let a = 0; a < v.length; ++a) {
        //     if (v[a] === socket.id) {
        //       key = k;
        //       ok = true;
        //     }
        //   }
        // }

        for (const [k, val] of Object.entries(connections)) {
          for (let socketId of val) {
            if (socketId === socket.id) {
              key = k;
              ok = true;
            }
          }
        }

        // Nếu
        if (ok === true) {
          if (messages[key] === undefined) {
            messages[key] = [];
          }
          messages[key].push({
            sender: sender,
            data: data,
            'socket-id-sender': socket.id,
          });
          // console.log("message", key, ":", sender, data);

          // for (let a = 0; a < connections[key].length; ++a) {
          //   io.to(connections[key][a]).emit(
          //     "chat-message",
          //     data,
          //     sender,
          //     socket.id
          //   );
          // }

          for (let socketId of connections[key]) {
            io.to(socketId).emit('chat-message', data, sender, socket.id);
          }
        }
      }
    });

    socket.on('abort trading', async (tradingId, path, username) => {
      if (socket.auth) {
        try {
          const user = await User.findOne({ username });
          console.log("🚀 ~ file: socket.js ~ line 400 ~ socket.on ~ user", user)
          const trading = await Trading.findById(tradingId);
          /// Nguoi huy la player thi hoan lai tien
          if (user._id.equals(trading.playerId)) {
          console.log("🚀 ~ file: socket.js ~ line 403 ~ socket.on ~ trading", trading)
            
            await new Transfer({
              sender: trading.playerId,
              receiver: trading.renterId,
              money: trading.money,
              type: "trade",
              tradingId: trading._id
            }).save((err, transfer) => {
              if(err){
                console.log("🚀 ~ file: socket.js ~ line 411 ~ socket.on ~ err", err)
              }
            })
            await Trading.findByIdAndUpdate(tradingId, {status: 'aborted', reason: `Trading is aborted by ${username}`})

            // emit cho ca 2
            io.to(path).emit(
              'abort trading',
              `Trading is aborted by ${user.fullName}`,
            );
          } else if(user._id.equals(trading.renterId)){
            // renter abort
            await Trading.findByIdAndUpdate(tradingId, {status: 'done', reason: `${username} is finished trading soon ....`})
            const player = await User.findById(trading.playerId)
            const player_profile = PlayerProfile.findOne({userId: player._id})
            // emit to all current socket of player
            for(let socketId of userSocketIdObj[player.username]){
              io.to(socketId).emit('abort trading', `Trading is aborted by ${user.fullName}`)
            }
            
            /// emit to all current socket of renter
            for(let socketId of userSocketIdObj[user.username]){
              io.to(socketId).emit('response abort trading for renter', player_profile._id)
            }
          }
          
        
        } catch (error) {
          console.log(
            '🚀 ~ file: socket.js ~ line 391 ~ socket.on ~ error',
            error,
          );
        }
      }
    });

    socket.on('done trading', async (tradingId, path) => {
      if(socket.auth){
        try {
          await Trading.findByIdAndUpdate(tradingId, { status: 'done' });
          io.to(path).emit('done trading', 'Trading is finished');
        } catch (error) {
          console.log(
            '🚀 ~ file: socket.js ~ line 401 ~ socket.on ~ error',
            error,
          );
        }
      }
    });

    socket.on('donate money', async (playerName, money) => {
      if(socket.auth){
        if(userSocketIdObj[playerName]){
          const sender = await User.findOne({username: socket.username})
          for(let socketId of userSocketIdObj[playerName]){
            io.to(socketId).emit('response donate money player', `${sender.fullName} donate ${money} $ for you !!!!`)
          }
        }
      }
    })

    socket.on('follow player', async (playerName) => {
      if(socket.auth){
        if(userSocketIdObj[playerName]){
          const sender = await User.findOne({username: socket.username})
          for(let socketId of userSocketIdObj[playerName]){
            io.to(socketId).emit('follow player', `${sender.fullName} is following you !!!!`)
          }
        }
      }
    })
    /// Chat Stream
    socket.on('user-join-streamhub', (path) => {
      if(socket.auth){
        if(!connectionsStreamhub[path]){ // Neu chua co room thi tao room = new Set()
          connectionsStreamhub[path] = new Set()
        }else{
          if(!connectionsStreamhub[path][socket.username]){ // Neu username do chua vao room 
            connectionsStreamhub[path].add(socket.username)
          }else{
            connectionsStreamhub[path][socket.username].add(socket.id)
          }
        } 
        socket.join(path)
      }
    })

    socket.on('message-streamhub', async (path, message) => {
      if(socket.auth){
        try {
          
          const user = await User.findOne({username: socket.username})
          if(!messagesStreamhub[path] ){
            messagesStreamhub[path] = []
          }
          const newMsg = {
            sender: user.fullName,
            content: message,
            avatar: user.avatar
          }
          console.log("🚀 ~ file: socket.js ~ line 594 ~ socket.on ~ newMsg", newMsg)
            messagesStreamhub[path].push(newMsg)
            
            io.to(path).emit('message-streamhub', newMsg)

        } catch (error) {
          console.log("🚀 ~ file: socket.js ~ line 594 ~ socket.on ~ error", error)
        }
      }
    })

   
  });

  
  httpServer.listen(4000);
};
