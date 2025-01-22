//Using abstraction
class BaseModel {
  constructor() {
    if (this.constructor === BaseModel) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  async save() {
    throw new Error("Method 'save()' must be implemented.");
  }

  static async fetchById(id) {
    throw new Error("Method 'fetchById()' must be implemented.");
  }

  static async fetchAll() {
    throw new Error("Method 'fetchAll()' must be implemented.");
  }

}

module.exports = BaseModel;
