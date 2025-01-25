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
  const token = req.cookies.token;

  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
    };
  } catch (error) {
    res.locals.user = null;
    res.clearCookie('token');
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect('/login');
  }
  next();
};

module.exports = { isAuth, isAdmin, setUser, requireAuth };
