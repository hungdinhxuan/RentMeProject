module.exports = (req, res, next) => {
  if (req.user.deleted) {
    return res.status(401).json({
      success: false,
      message:
        'Your account has been deleted. Please contact admin at system@rentme.games',
    });
  } else if (req.user.status === 'banned') {
    return res.status(401).json({
      success: false,
      message:
        'Your account has been banned. Please contact admin at system@rentme.games',
    });
  }
  next();
};
