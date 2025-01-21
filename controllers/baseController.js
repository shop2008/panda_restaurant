class BaseController {
  constructor() {
    if (this.constructor === BaseController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  // Base render method that all controllers can use
  render(res, view, options = {}) {
    const defaultOptions = {
      pageTitle: 'Default Title',
      path: '/',
      ...options,
    };

    res.render(view, defaultOptions);
  }

  // Common error handling
  handleError(error, req, res, next) {
    console.error('Controller Error:', error);
    next(error);
  }

  // Common success response
  sendSuccess(res, data, message = 'Success') {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  // Common validation method
  validate(data, rules) {
    const errors = [];
    for (const [field, rule] of Object.entries(rules)) {
      if (rule.required && !data[field]) {
        errors.push(`${field} is required`);
      }
    }
    return errors;
  }
}

module.exports = BaseController;
