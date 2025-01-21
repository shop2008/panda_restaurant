const BaseController = require('./BaseController');
const BookingInfo = require('../models/BookingModel');

class BookingController extends BaseController {
  constructor() {
    super();
  }

  async getAllBookings(req, res, next) {
    try {
      const alldatarows = await BookingInfo.fetchAll();
      this.render(res, 'reservationsearch', {
        confirmationData: alldatarows,
        pageTitle: 'All Reservations',
        path: '/reservationsearch',
        UsingSearchFunction: false,
      });
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  async getFilteredBookings(req, res, next) {
    try {
      const guestName = req.body.guestName;
      const filteredBookings = await BookingInfo.filterByGuestName(guestName);

      this.render(res, 'reservationsearch', {
        confirmationData: filteredBookings || null,
        pageTitle: 'Filtered Reservations',
        path: '/getAllBookings',
        UsingSearchFunction: true,
        keywords: guestName,
      });
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  async postAddBookingData(req, res, next) {
    try {
      // Validate input
      const validationRules = {
        firstName: { required: true },
        lastName: { required: true },
        email: { required: true },
        phone: { required: true },
      };

      const validationErrors = this.validate(req.body, validationRules);
      if (validationErrors.length > 0) {
        return this.render(res, 'tablebooking', {
          hasErrorInsertedData: true,
          pageTitle: 'Restaurant Booking',
          path: '/bookingform',
          errors: validationErrors,
        });
      }

      const tableDetails = this.getTableDetails(req.body.tableType);
      const booking = new BookingInfo({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        numberOfGuests: req.body.numberOfGuests,
        date: this.formatDate(req.body.date),
        time: req.body.time,
        tableType: tableDetails.tableType,
        specialRequests: req.body.specialRequests || null,
      });

      const bookingId = await booking.save();
      if (!bookingId) {
        throw new Error('Failed to save booking');
      }

      const bookingRow = await BookingInfo.fetchById(bookingId);
      this.render(res, 'bookingconfirmation', {
        confirmationData: bookingRow,
        pageTitle: 'Booking Confirmation Page',
        path: '/bookingconfirmation',
      });
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  getTableDetails(tableType) {
    const tableTypes = {
      0: 'Two-seater Table',
      1: 'Four-seater Table',
      2: 'Six-seater Table',
      3: 'Large Group Table',
    };
    return { tableType: tableTypes[tableType] || 'Not Selected' };
  }

  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  }

  getBookingInfo(req, res, next) {
    res.json({
      message: 'Booking confirmation information',
    });
  }
}

module.exports = new BookingController();
