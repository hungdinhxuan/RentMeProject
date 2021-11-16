const User = require('../models/users.model');
const Transfer = require('../models/transfers.model');

module.exports = {
  profitsBasedOnIntervalTime: async (req, res) => {
    const { time } = req.query;
    try {
      switch (time) {
        case '30d':
          const year = new Date().getFullYear();
          const month = new Date().getMonth() + 1;
          const transfers = await Transfer.aggregate([
            {
              $group: {
                _id: {
                  $dateToString: {
                    date: '$createdAt',
                    format: '%Y-%m-%d',
                  },
                },
                profit: { $sum: '$profit' },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $match: {
                _id: {
                  $gte: `${year}-${month}-01`,
                  $lte: `${year}-${month}-${new Date(
                    year,
                    month,
                    0,
                  ).getDate()}`,
                },
              },
            },
            {
              $project: {
                _id: 0,
                date: '$_id',
                profit: '$profit',
                count: '$count',
              },
            },
          ]);
          return res.status(200).send(transfers);
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid time',
          });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  },
  summary: async (req, res) => {
    try {
      const result = await Promise.all([
        Transfer.aggregate([
          {
            $group: {
              _id: null,
              totalProfit: { $sum: '$profit' },
              totalTransfers: { $sum: 1 },
            },
          },
        ]),
        User.aggregate([
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ]),
      ]);
      console.log(result);
      return res.status(200).json({
        profit: result[0][0].totalProfit,
        totalTransfers: result[0][0].totalTransfers,
        usersCount: result[1][0].count,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  },
};
