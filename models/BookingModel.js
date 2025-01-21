const db = require('../utils/database');

module.exports = class BookingModel {
  // Constructor
  constructor(
    firstName,
    lastName,
    email,
    phone,
    numberOfGuests,
    date,
    time,
    tableType,
    specialRequests
  ) {
    this.bookingId = null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.numberOfGuests = numberOfGuests;
    this.date = date;
    this.time = time;
    this.tableType = tableType;
    this.specialRequests = specialRequests;
  }

  async save() {
    const bookingResult = await db.execute(
      'INSERT INTO BOOKING (first_name, last_name, email, phone, number_of_guests, date, time, table_type, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        this.firstName,
        this.lastName,
        this.email,
        this.phone,
        this.numberOfGuests,
        this.date,
        this.time,
        this.tableType,
        this.specialRequests,
        'Confirmed',
      ]
    );

    this.bookingId = bookingResult[0].insertId ?? null;
    return this.bookingId;
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
};
