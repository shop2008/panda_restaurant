//Using abstraction
class BaseModel {
  constructor() {
    if (this.constructor === BaseModel) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.errors = [];
  }

  // Common validation method
  validate() {
    this.errors = [];
    if (!this.validationRules) {
      return true;
    }

    for (const [field, rules] of Object.entries(this.validationRules)) {
      if (rules.required && !this[field]) {
        this.errors.push(`${field} is required`);
      }
      if (rules.minLength && this[field].length < rules.minLength) {
        this.errors.push(
          `${field} must be at least ${rules.minLength} characters`
        );
      }
      if (rules.maxLength && this[field].length > rules.maxLength) {
        this.errors.push(
          `${field} must be less than ${rules.maxLength} characters`
        );
      }
    }

    return this.errors.length === 0;
  }

  // Common error handling
  hasErrors() {
    return this.errors.length > 0;
  }

  getErrors() {
    return this.errors;
  }

  // Abstract methods
  async save() {
    throw new Error("Method 'save()' must be implemented.");
  }

  static async fetchById(id) {
    throw new Error("Method 'fetchById()' must be implemented.");
  }

  static async fetchAll() {
    throw new Error("Method 'fetchAll()' must be implemented.");
  }

  // Common utility methods
  toJSON() {
    const obj = {};
    for (const [key, value] of Object.entries(this)) {
      if (
        typeof value !== 'function' &&
        key !== 'errors' &&
        key !== 'validationRules'
      ) {
        obj[key] = value;
      }
    }
    return obj;
  }
}

module.exports = BaseModel;
