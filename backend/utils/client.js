const userSocketIdObj = {};
const User = require('../models/users.model');

async function addClientToObj(username, socketId, role, io) {
  if (!userSocketIdObj.hasOwnProperty(username)) {
    //when user is joining first time
    userSocketIdObj[username] = new Set([socketId]);
    await User.findOneAndUpdate(
      { username },
      { isOnline: true },
      { new: true },
    );
    console.log(`${username} is online with role ${role}`);
    // that user is a player
    if (role == 2) {
      // Notify to client to load player list
      console.log('emitted');
      io.emit('refreshPlayerList');
    }
  } else {
    //user had already joined from one client and now joining using another client
    userSocketIdObj[username].add(socketId);
  }
  console.log(userSocketIdObj);
}



async function removeClientFromObj(username, socketId, role, io, event = null) {
  if (userSocketIdObj.hasOwnProperty(username)) {
    let userSocketIdSet = userSocketIdObj[username];
    userSocketIdSet.delete(socketId);
    //if there are no clients for a user, remove that user from online list(Obj) and set status to offline;
    if (userSocketIdSet.size == 0) {
      delete userSocketIdObj[username];
      try {
        await User.findOneAndUpdate(
          { username },
          { isOnline: false },
          { new: true },
        );

        if (role == 2) {
          // Notify to client to load player list
          console.log('emit disconnected');
          io.emit('refreshPlayerList');
        }
        console.log(`${username} is offline`);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (event === 'logout') {
        delete userSocketIdObj[username];
        try {
          await User.findOneAndUpdate(
            { username },
            { isOnline: false },
            { new: true },
          );

          if (role == 2) {
            // Notify to client to load player list
            console.log('emit disconnected');
            io.emit('refreshPlayerList');
          }
          console.log(`${username} is offline`);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}


module.exports = {
  userSocketIdObj,
  addClientToObj,
  removeClientFromObj,
};
