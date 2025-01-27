const BaseModel = require('./BaseModel');
const db = require('../utils/database');

class MenuModel extends BaseModel {
  #id;
  #name;
  #price;

  constructor(menuData) {
    super();
    this.#id = menuData.id || null;
    this.#name = menuData.name;
    this.#price = menuData.price;

    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      price: {
        required: true,
        type: 'number',
        min: 0,
      },
    };
  }

  // Getters and setters
  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get price() {
    return this.#price;
  }

  set price(value) {
    this.#price = value;
  }

  async save() {
    try {
      // Validate before saving
      if (!this.validate()) {
        throw new Error(this.getErrors().join(', '));
      }

      if (this.#id) {
        const [result] = await db.execute(
          'UPDATE menu_items SET name=?, price=? WHERE id=?',
          [this.#name, this.#price, this.#id]
        );
        return result.affectedRows > 0;
      }

      const [result] = await db.execute(
        'INSERT INTO menu_items (name, price) VALUES (?, ?)',
        [this.#name, this.#price]
      );
      this.#id = result.insertId;
      return this.#id;
    } catch (error) {
      throw error;
    }
  }

  static async fetchById(id) {
    try {
      const [items] = await db.execute(
        'SELECT * FROM menu_items WHERE id = ?',
        [id]
      );
      return items[0] ? new MenuModel(items[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async fetchAll() {
    try {
      const [items] = await db.execute('SELECT * FROM menu_items');
      return items.map((item) => new MenuModel(item));
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM menu_items WHERE id = ?', [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Override toJSON method from BaseModel
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      price: this.#price,
    };
  }
}

module.exports = MenuModel;
