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
  }

  async save() {
    if (this.#id) {
      return db.execute('UPDATE menu_items SET name=?, price=? WHERE id=?', [
        this.#name,
        this.#price,
        this.#id,
      ]);
    }
    return db.execute('INSERT INTO menu_items (name, price) VALUES (?, ?)', [
      this.#name,
      this.#price,
    ]);
  }

  static async fetchById(id) {
    const [items] = await db.execute('SELECT * FROM menu_items WHERE id = ?', [
      id,
    ]);
    return items[0];
  }

  static async fetchAll() {
    const [items] = await db.execute('SELECT * FROM menu_items');
    return items;
  }

  static async delete(id) {
    return db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  }
}

module.exports = MenuModel;
