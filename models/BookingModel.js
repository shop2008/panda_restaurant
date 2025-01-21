const db = require('../utils/database');

module.exports = class BookingModel {
  // Constructor
  constructor(firstName, lastName, email, phone, address, city, state, roomType, pricePerNight, numberOfChildren, numberOfAdults, arrivalDate, arrivalTime, sessionOfArrival, departureDate, departureTime, sessionOfDeparture, cardNumber, expirationDate, cvv, postalCode, specialRequests) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.city = city;
    this.state = state;
    this.roomType = roomType;
    this.pricePerNight = pricePerNight;
    this.numberOfChildren = numberOfChildren;
    this.numberOfAdults = numberOfAdults;
    this.arrivalDate = arrivalDate;
    this.arrivalTime = arrivalTime;
    this.sessionOfArrival = sessionOfArrival;
    this.departureDate = departureDate;
    this.departureTime = departureTime;
    this.sessionOfDeparture = sessionOfDeparture;
    this.cardNumber = cardNumber;
    this.expirationDate = expirationDate;
    this.cvv = cvv;
    this.postalCode = postalCode;
    this.specialRequests = specialRequests;
  }

  async checkGuestExists(email) {
    try {
      const query = 'SELECT guest_id FROM GUEST WHERE email = ? LIMIT 1';
      const results = await db.execute(query, [email]);
      console.log("Database results:", results);

      // Adjust depending on the actual structure of results
      const guestId = results[0] && results[0].length > 0 ? results[0][0].guest_id : null;
      console.log("Guest ID found:", guestId);
      return guestId;
    } catch (error) {
      console.error("Error in checkGuestExists:", error);
      return null;
    }
  }

  async save() {
    console.log(this);
    // ========starting to store to model
    let guestId = '';

    // Check if guest already exists
    const existingGuestId = await this.checkGuestExists(this.email);

    if (existingGuestId) {
      console.log('Guest already exists with ID:', existingGuestId);
      guestId = existingGuestId;
    } else {
      // Save guest information
      const guestResult = await db.execute('INSERT INTO GUEST (first_name, last_name, email, phone, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [this.firstName, this.lastName, this.email, this.phone, this.address, this.city, this.state]);
      guestId = guestResult[0].insertId; // Assuming insertId is returned by your database driver
      console.log(guestId);
    }

    // Save booking information
    const bookingResult = await db.execute('INSERT INTO BOOKING (guest_id, room_type, price_per_night, num_adults, num_children, arrival_date, arrival_time, session_arrival, departure_date, departure_time, session_departure, special_request, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [guestId, this.roomType, this.pricePerNight, this.numberOfAdults, this.numberOfChildren, this.arrivalDate, this.arrivalTime, this.sessionOfArrival, this.departureDate, this.departureTime, this.sessionOfDeparture, this.specialRequests, 'Confirmed']);

    const bookingId = bookingResult[0].insertId;

    // Save payment information
    await db.execute('INSERT INTO PAYMENT (booking_id, card_number, expiration_date, cvv, postal_code) VALUES (?, ?, ?, ?, ?)',
      [bookingId, this.cardNumber, this.expirationDate, this.cvv, this.postalCode]);

    console.log("Booking information saved successfully");
    this.id = bookingResult[0].insertId ?? null;

    return this.id;
  }

  // Method to fecth booking data by booking id
  static async fetchById(id) {
    const result = await db.execute('SELECT * FROM BOOKING B, GUEST G, PAYMENT P WHERE B.guest_id = G.guest_id AND B.booking_id = P.booking_id AND B.booking_id= ?', [id]);
    return result[0];
  }

  // Method to fetch all bookings with complete reservation details
  static async fetchAll() {
    try {
      const result = await db.execute(`
      SELECT DISTINCT * FROM BOOKING B, GUEST G, PAYMENT P WHERE B.guest_id = G.guest_id AND B.booking_id = P.booking_id
    `);

      if (typeof result[0] === 'undefined' || result[0].length === 0) {
        return null;
      } else {
        return result[0];
      }

    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }

  // Method to filter bookings by guest name
  static async filterByGuestName(GuestName) {
    const results = await db.execute(
      `SELECT DISTINCT *
     FROM BOOKING b
     JOIN GUEST g ON b.guest_id = g.guest_id
     JOIN PAYMENT p ON b.booking_id = p.booking_id
     WHERE LOWER(g.first_name) LIKE ? 
        OR LOWER(g.last_name) LIKE ? 
        OR LOWER(CONCAT(g.first_name, ' ', g.last_name)) LIKE ?`,
      [GuestName.toLowerCase(), GuestName.toLowerCase(), GuestName.toLowerCase()]
    );

    if (results[0] && results[0].length > 0) {
      console.log(results[0]);
      return results[0];
    } else {
      return null;
    }
  }
};
