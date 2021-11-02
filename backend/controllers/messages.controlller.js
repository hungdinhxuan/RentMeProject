const Messages = require('../models/messages.model');

class MessagesController {
  async getAllMsg(req, res) {
    // type === sender thì lấy ra toàn bộ tin nhắn đã gửi đi
    // type === receiver thì lấy ra toàn bộ tin nhắn đã được gửi đến

    const { type } = req.query;
    const { id } = req.params;
    if (req.user._id != id) {
      return res.status(400).json({
        success: false,
        message: 'Token is not valid',
      });
    }
    if (type === 'sent') {
      try {
        const messages = await Messages.find({ senderId: req.user._id });
        return res.status(200).json(messages);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    } else if (type === 'received') {
      try {
        const messages = await Messages.find({ receiverId: req.user._id });
        return res.status(200).json(messages);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    } else {
      try {
        const messages = await Messages.find({
          $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        }).lean();
        
        const others = new Set();
        messages.map((msg) => {
          if (msg.senderId !== req.user._id) {
            others.add(msg.senderId);
          } else if (msg.receiverId !== req.user._id) {
            others.add(msg.receiverId);
          }
        });
        const formattedMessages = {};
        for (let other in others) {
          formattedMessages[other.toString()] = messages.filter(
            (msg) => msg._id == other,
          );
          console.log(other);
        }
        // console.log(formattedMessages);
        return res.status(200).json(messages);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    }
  }
  async readMsg(req, res) {
    try {
      const { msgId } = req.params;

      let msg = await Messages.findById(msgId);
      // console.log(req.user._id, msg);
      if (
        req.user._id.toString() != msg.senderId.toString() &&
        req.user._id.toString() != msg.receiverId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Token is not valid',
        });
      }
      msg = await Messages.findByIdAndUpdate(msgId, { status: 'read' });
      return res.status(200).json({ success: true, message: 'ok', newMessage: msg});
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
  async deleteById(req, res) {
    try {
      const { msgId } = req.params;
      let msg = await Messages.findById(msgId);
      if (
        req.user._id.toString() != msg.senderId.toString() &&
        req.user._id.toString() != msg.receiverId.toString()
      )  {
        return res.status(400).json({
          success: false,
          message: 'Token is not valid',
        });
      }
      await Messages.findByIdAndDelete(msgId);
      
      return res
        .status(200)
        .json({ success: true, message: `message removed`, msgId });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
module.exports = new MessagesController();
