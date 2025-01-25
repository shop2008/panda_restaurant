const BaseModel = require('./BaseModel');
const db = require('../utils/database');
const bcrypt = require('bcryptjs');

class UserModel extends BaseModel {
  #id;
  #email;
  #password;
  #firstName;
  #lastName;
  #role;

  constructor(userData) {
    super();
    this.#id = userData.id || null;
    this.#email = userData.email;
    this.#password = userData.password;
    this.#firstName = userData.firstName;
    this.#lastName = userData.lastName;
    this.#role = userData.role || 'customer';
  }

  async save() {
    try {
      const hashedPassword = await bcrypt.hash(this.#password, 12);
      const [result] = await db.execute(
        'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
        [
          this.#email,
          hashedPassword,
          this.#firstName,
          this.#lastName,
          this.#role,
        ]
      );
      this.#id = result.insertId;
      return this.#id;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      return rows[0]
        ? {
            id: rows[0].id,
            email: rows[0].email,
            password: rows[0].password,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            role: rows[0].role,
          }
        : null;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  get id() {
    return this.#id;
  }
  get email() {
    return this.#email;
  }
  get firstName() {
    return this.#firstName;
  }
  get lastName() {
    return this.#lastName;
  }
  get role() {
    return this.#role;
  }
}

module.exports = UserModel;
