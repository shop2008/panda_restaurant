const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

class AuthController {
  getLogin(req, res) {
    res.render('auth/login', {
      pageTitle: 'Login',
      errorMessage: null,
    });
  }

  getRegister(req, res) {
    res.render('auth/register', {
      pageTitle: 'Register',
      errorMessage: null,
    });
  }

  async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.render('auth/login', {
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.render('auth/login', {
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
      });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).render('auth/login', {
        pageTitle: 'Login',
        errorMessage: 'An error occurred during login',
      });
    }
  }

  async postRegister(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.render('auth/register', {
          pageTitle: 'Register',
          errorMessage: 'Email already exists',
        });
      }

      const user = new UserModel({
        email,
        password,
        firstName,
        lastName,
        role: 'customer',
      });

      await user.save();
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).render('auth/register', {
        pageTitle: 'Register',
        errorMessage: 'An error occurred during registration',
      });
    }
  }

  logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    res.redirect('/login');
  }
}

module.exports = new AuthController();
