const userSocketIdObj = {};
const User = require('../models/users.models');

async function addClientToObj(username, socketId) {
    if (!userSocketIdObj.hasOwnProperty(username)) {
      //when user is joining first time
      userSocketIdObj[username] = new Set([socketId]);
      await User.findOneAndUpdate({ username }, { isOnline: true });
      console.log(`${username} is online`);
    } else {
      //user had already joined from one client and now joining using another client
      userSocketIdObj[username].add(socketId);
    }
  }

  async function removeClientFromObj(username, socketId) {
    if (userSocketIdObj.hasOwnProperty(username)) {
      let userSocketIdSet = userSocketIdObj[username];
      userSocketIdSet.delete(socketId);
      //if there are no clients for a user, remove that user from online list(Obj) and set status to offline;
      if (userSocketIdSet.size == 0) {
        delete userSocketIdObj[username];
        try {
          await User.findOneAndUpdate({ username }, { isOnline: false });
          console.log(`${username} is offline`);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  module.exports = {
    userSocketIdObj,
    addClientToObj,
    removeClientFromObj
  }