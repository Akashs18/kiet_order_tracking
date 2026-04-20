exports.isAdmin = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.status(401).redirect('/auth/login');
  }

  // Check if user is ADMIN
  if (req.session.user.role !== 'ADMIN') {
    return res.status(403).send('Access denied - Admin only');
  }
  
  next();
};