const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/login');
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('error', {
      message: 'Access denied',
      pageTitle: 'Error',
    });
  }
  next();
};

const setUser = (req, res, next) => {
  res.locals.user = null;
  console.log('Checking token...');

  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
      console.log('User set in locals:', res.locals.user);
    } else {
      console.log('No token found');
    }
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.clearCookie('token');
  }

  next();
};

module.exports = { isAuth, isAdmin, setUser };
