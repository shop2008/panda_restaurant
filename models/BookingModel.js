const BaseModel = require('./BaseModel');
const db = require('../utils/database');

// Using Encapsulation and Inheritance features
class BookingModel extends BaseModel {
  #bookingId;
  #firstName;
  #lastName;
  #email;
  #phone;
  #numberOfGuests;
  #date;
  #time;
  #tableType;
  #specialRequests;
  #status;

  constructor(bookingData) {
    super();
    this.#bookingId = null;
    this.#firstName = bookingData.firstName;
    this.#lastName = bookingData.lastName;
    this.#email = bookingData.email;
    this.#phone = bookingData.phone;
    this.#numberOfGuests = bookingData.numberOfGuests;
    this.#date = bookingData.date;
    this.#time = bookingData.time;
    this.#tableType = bookingData.tableType;
    this.#specialRequests = bookingData.specialRequests;
    this.#status = 'Confirmed';
  }

  // Getters and setters
  get bookingId() {
    return this.#bookingId;
  }
  get firstName() {
    return this.#firstName;
  }
  set firstName(value) {
    this.#firstName = value;
  }
  get lastName() {
    return this.#lastName;
  }
  set lastName(value) {
    this.#lastName = value;
  }
  get email() {
    return this.#email;
  }
  set email(value) {
    this.#email = value;
  }
  get phone() {
    return this.#phone;
  }
  set phone(value) {
    this.#phone = value;
  }
  get numberOfGuests() {
    return this.#numberOfGuests;
  }
  set numberOfGuests(value) {
    this.#numberOfGuests = value;
  }
  get date() {
    return this.#date;
  }
  set date(value) {
    this.#date = value;
  }
  get time() {
    return this.#time;
  }
  set time(value) {
    this.#time = value;
  }
  get tableType() {
    return this.#tableType;
  }
  set tableType(value) {
    this.#tableType = value;
  }
  get specialRequests() {
    return this.#specialRequests;
  }
  set specialRequests(value) {
    this.#specialRequests = value;
  }
  get status() {
    return this.#status;
  }
  set status(value) {
    this.#status = value;
  }

  async save() {
    const bookingResult = await db.execute(
      'INSERT INTO BOOKING (first_name, last_name, email, phone, number_of_guests, date, time, table_type, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        this.#firstName,
        this.#lastName,
        this.#email,
        this.#phone,
        this.#numberOfGuests,
        this.#date,
        this.#time,
        this.#tableType,
        this.#specialRequests,
        this.#status,
      ]
    );
    this.#bookingId = bookingResult[0].insertId ?? null;
    return this.#bookingId;
  }

  toJSON() {
    return {
      bookingId: this.#bookingId,
      firstName: this.#firstName,
      lastName: this.#lastName,
      email: this.#email,
      phone: this.#phone,
      numberOfGuests: this.#numberOfGuests,
      date: this.#date,
      time: this.#time,
      tableType: this.#tableType,
      specialRequests: this.#specialRequests,
      status: this.#status,
    };
  }

  // Method to fecth booking data by booking id
  static async fetchById(id) {
    const result = await db.execute(
      'SELECT * FROM BOOKING WHERE booking_id = ?',
      [id]
    );
    return result[0][0] || null;
  }

  // Method to fetch all bookings with complete reservation details
  static async fetchAll() {
    try {
      const result = await db.execute('SELECT * FROM BOOKING');
      return result[0]?.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }

  // Method to filter bookings by guest name
  static async filterByGuestName(guestName) {
    const searchPattern = `%${guestName.toLowerCase()}%`;
    const results = await db.execute(
      `SELECT * FROM BOOKING 
       WHERE LOWER(first_name) LIKE ? 
          OR LOWER(last_name) LIKE ? 
          OR LOWER(CONCAT(first_name, ' ', last_name)) LIKE ?`,
      [searchPattern, searchPattern, searchPattern]
    );

    return results[0]?.length > 0 ? results[0] : null;
  }
}

module.exports = BookingModel;
