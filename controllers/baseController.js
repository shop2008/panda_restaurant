class BaseController {
  constructor() {
    if (this.constructor === BaseController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  // Base render method that all controllers can use
  async render(res, view, options = {}) {
    try {
      const defaultOptions = {
        pageTitle: 'Default Title',
        path: '/',
        errors: [],
        success: null,
        csrfToken: res.locals.csrfToken,
        currentUser: res.locals.currentUser,
        ...options,
      };

      res.render(view, defaultOptions);
    } catch (error) {
      this.handleError(error, null, res);
    }
  }

  // Polymorphism
  handleError(error, req, res, next) {
    console.error('Controller Error:', error);

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return this.render(res, req.originalUrl.slice(1) || 'error', {
        errors: [error.message],
        pageTitle: 'Error',
      });
    }

    if (error.statusCode === 404) {
      return this.render(res, '404', {
        pageTitle: 'Page Not Found',
      });
    }

    // Default error handling
    this.render(res, 'error', {
      pageTitle: 'Error',
      errors: ['An unexpected error occurred'],
    });
  }

  // validation
  validate(data, rules) {
    const errors = [];
    for (const [field, rule] of Object.entries(rules)) {
      if (rule.required && !data[field]) {
        errors.push(`${field} is required`);
      }
      if (rule.minLength && data[field].length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength && data[field].length > rule.maxLength) {
        errors.push(`${field} must be less than ${rule.maxLength} characters`);
      }
      if (rule.pattern && !rule.pattern.test(data[field])) {
        errors.push(`${field} format is invalid`);
      }
    }
    return errors;
  }

  // Common response methods
  sendSuccess(res, data, message = 'Success') {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  sendError(res, error, status = 500) {
    res.status(status).json({
      success: false,
      message: error.message || 'Internal server error',
      errors: error.errors || [error.message],
    });
  }

  // Common redirect with flash message
  redirectWithMessage(res, path, message, type = 'success') {
    if (res.locals.flash) {
      res.locals.flash[type] = message;
    }
    res.redirect(path);
  }
}

module.exports = BaseController;
