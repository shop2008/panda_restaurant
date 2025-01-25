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
      console.log('Login attempt:', { email, password });
      // Get user from database
      const user = await UserModel.findByEmail(email);
      console.log('User found:', user);
      if (!user) {
        return res.render('auth/login', {
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
        });
      }

      // Verify password
      const isValidPassword = await UserModel.validatePassword(
        password,
        user.password
      );
      console.log('Password validation result:', isValidPassword);
      if (!isValidPassword) {
        return res.render('auth/login', {
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
        });
      }

      // Create token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Redirect based on role
      if (user.role === 'admin') {
        res.redirect('/getAllBookings');
      } else {
        res.redirect('/');
      }
    } catch (error) {
      console.error('Login error:', error);
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
