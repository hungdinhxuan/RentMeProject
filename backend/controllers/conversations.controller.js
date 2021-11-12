const Conversations = require('../models/conversations.models');
class ConversationsController {
  async getAllWithUserId(req, res) {
    try {
      const conversations = await Conversations.find({
        $or: [
          {
            $and: [
              { senderId: req.user._id },
              { receiverId: req.params.userId },
            ],
          },
          {
            $and: [
              { senderId: req.params.userId },
              { receiverId: req.user._id },
            ],
          },
        ],
      });
      return res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
  async sendMessage(req, res) {
    const { content } = req.body;
    try {
      const conversation = await Conversations.create({
        senderId: req.user._id,
        receiverId: req.params.userId,
        content,
      });
      return res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
  async getOthersInConversation(req, res) {
    try {
      const conversations = await Conversations.find(
        {
          // find others in conversation
          $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        },
        {},
        { sort: { createdAt: -1 } },
      )
        .populate({
          path: 'senderId',
          ref: 'users',
          select: 'avatar fullName isOnline',
        })
        .populate({
          path: 'receiverId',
          ref: 'users',
          select: 'avatar fullName isOnline',
        });

      let others = [];

      let otherIds = new Set();

      for (let i = 0; i < conversations.length; i++) {
        if (!conversations[i].senderId._id.equals(req.user._id)) {
          otherIds.add(conversations[i].senderId._id.toString());
        } else if (!conversations[i].receiverId._id.equals(req.user._id)) {
          otherIds.add(conversations[i].receiverId._id.toString());
        }
      }

      for (let otherId of otherIds) {
        let senderConversation = conversations.find((conversation) =>
          conversation.senderId._id.equals(otherId),
        );
        let receiverConversation = conversations.find((conversation) =>
          conversation.receiverId._id.equals(otherId),
        );
        if (senderConversation) {
          others.push({
            otherId,
            otherAvatar: senderConversation.senderId.avatar,
            otherFullName: senderConversation.senderId.fullName,
            lastestMessage: senderConversation.content,
            createdAt: senderConversation.createdAt,
            isOnline: senderConversation.senderId.isOnline,
          });
        } else if (receiverConversation) {
          others.push({
            otherId,
            otherAvatar: receiverConversation.receiverId.avatar,
            otherFullName: receiverConversation.receiverId.fullName,
            lastestMessage: receiverConversation.content,
            createdAt: receiverConversation.createdAt,
            isOnline: receiverConversation.receiverId.isOnline,
          });
        }
      }

      return res.status(200).json({
        others,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}

module.exports = new ConversationsController();
