module.exports = {
  AdminRole: (req, res, next) => {
    return req.user.role < 1
      ? next()
      : res.status(403).json({
          success: false,
          message: 'You are not allowed to access this resource.',
        });
  },
  StreamerRole: (req, res, next) => {
    return req.user.role < 2
      ? next()
      : res.status(403).json({
          success: false,
          message: 'You are not allowed to access this resource.',
        });
  },
  PlayerRole: (req, res, next) => {
    return req.user.role < 3
      ? next()
      : res.status(403).json({
          success: false,
          message: 'You are not allowed to access this resource.',
        });
  },
  CustomerRole: (req, res, next) => {
    return req.user.role < 4
      ? next()
      : res.status(403).json({
          success: false,
          message: 'You are not allowed to access this resource.',
        });
  },
};
