const BaseController = require('./BaseController');
const BookingInfo = require('../models/BookingModel');

class SearchController extends BaseController {
  constructor() {
    super();
  }

  // Polymorphism
  async render(res, view, options = {}) {
    try {

      const allDataRows = await BookingInfo.filterByGuestName(options.guestName);
      console.log("=== Call render method in searchController ========")
      console.log(allDataRows)
      console.log("=====================================================")

      super.render(res, view, {
        confirmationData: allDataRows,
        pageTitle: 'All Reservations',
        path: '/reservationsearch',
        usingSearchFunction: false
      });
    } catch (error) {
      this.handleError(error, null, res, null);
    }
  }

  async getFilteredBookings(req, res, next) {
    try {
      const guestName = req.body.guestName;
      // call render method in this sub-class
      this.render(res, 'reservationsearch', { guestName: guestName });
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  // Polymorphism
  handleError(error, req, res, next) {
    // Implement error handling, possibly logging and sending a HTTP error response
    console.error(error);
    res.status(500).send('Something wrong with searching data!');
  }
}

module.exports = new SearchController();
