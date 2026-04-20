exports.isAdmin = (req, res, next) => {
  if (req.session.user.role !== 'ADMIN') {
    return res.status(403).send('Access denied');
  }
  next();
};