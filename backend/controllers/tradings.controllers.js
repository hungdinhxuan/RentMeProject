const Trading = require('../models/tradings.models');

class TradingsController {
  async authRoom(req, res) {
    const { roomId, roomPassword } = req.body;
    try {
      const trading = await Trading.findOne({ roomId, roomPassword });
      if (!trading) {
        //   socket.emit('error-auth-room', 'Room Id or Room Password is not correct')
        return res.status(404).json({
          success: false,
          message: 'RoomId or Password password is not correct',
        });
      } else {
        if (trading.status === 'aborted') {
          return res
            .status(403)
            .json({ success: false, message: 'This trading is aborted' });
        } else if (trading === 'done') {
          return res
            .status(403)
            .json({ success: false, message: 'This trading is done' });
        } else if (trading === 'pending') {
          // Kiem tra giao dich do co phai la pending va da het han hay chua
          let expirePendingTradingDate = new Date(trading.createdAt);
          expirePendingTradingDate.setMinutes(
            expirePendingTradingDate.getMinutes() + trading.expireIn,
          );
          if (expirePendingTradingDate.getTime() < new Date().getTime()) {
            await Trading.findByIdAndUpdate(trading._id, { status: 'aborted' });
            return res
              .status(406)
              .json({
                success: false,
                message: 'This trading is expired and aborted!',
              });
          } else {
            // console.log();
            await Trading.findByIdAndUpdate(trading._id, {
              status: 'performing',
            });
            let expirePerformingTradingDate = new Date(trading.createdAt);
            expirePerformingTradingDate.setHours(
              expirePerformingTradingDate.getHours() + trading.time,
            );
            return res
              .status(200)
              .json({
                success: true,
                message: 'authenticated',
                expireTime: expirePerformingTradingDate,
                tradingId: trading._id,
                roomId: trading.roomId,
                roomPassword: trading.roomPassword
              });
          }
        } else {
          
          let expirePerformingTradingDate = new Date(trading.createdAt);
          console.log("🚀 ~ file: tradings.controllers.js ~ line 58 ~ TradingsController ~ authRoom ~ expirePerformingTradingDate", expirePerformingTradingDate)
          expirePerformingTradingDate.setHours(
            expirePerformingTradingDate.getHours() + trading.time,
          );
          if (expirePerformingTradingDate.getTime() < new Date().getTime()) {
            await Trading.findByIdAndUpdate(trading._id, { status: 'aborted' });
            return res
              .status(406)
              .json({
                success: false,
                message: 'This trading is expired and aborted!',
              });
          }
          return res
            .status(200)
            .json({
              success: true,
              message: 'authenticated',
              expireTime: expirePerformingTradingDate,
              tradingId: trading._id,
              roomId: trading.roomId,
              roomPassword: trading.roomPassword
            });
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: tradings.controllers.js ~ line 55 ~ TradingsController ~ authRoom ~ error',
        error,
      );

      return res
        .status(500)
        .json({
          success: true,
          message: error.message || 'Internal Server Error',
        });
    }
  }
}

module.exports = new TradingsController();
