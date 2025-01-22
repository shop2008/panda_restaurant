const BaseController = require('./BaseController');
const BookingInfo = require('../models/BookingModel');
const path = require('../utils/path');

class BookingController extends BaseController {
  constructor() {
    super();
  }

  // Polymorphism
  async render(res, view, options = {}) {
    try {
      let allDataRows = null;

      if (options.usingSearchByID === false) {
        allDataRows = await BookingInfo.fetchAll();
      } else {
        allDataRows = await BookingInfo.fetchById(options.BookingId);
      }

      console.log("=== Call render method in bookingController ========")
      console.log(allDataRows)
      console.log("=====================================================")

      // Ensure options are correctly used and structured
      super.render(res, view, {
        confirmationData: allDataRows,
        pageTitle: 'All Reservations',
        path: options.path,
        usingSearchFunction: false
      });

    } catch (error) {
      this.handleError(error, null, res, null);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      // call render method in this sub-class
      this.render(res, 'reservationsearch', { usingSearchByID: false, path: '/reservationsearch' });

    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  // Polymorphism
  handleError(error, req, res, next) {
    // Implement error handling, possibly logging and sending a HTTP error response
    console.error(error);
    res.status(500).send('Something wrong with get booking data!');
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

      // go to confirmation page 
      this.render(res, 'bookingconfirmation', { usingSearchByID: true, BookingId: bookingId, path: 'bookingconfirmation' });

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
