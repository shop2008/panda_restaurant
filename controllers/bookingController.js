const BookingInfo = require('../models/BookingModel');

// get all reservations data
exports.getAllBookings = async (req, res, next) => {
  try {
    // Get all booking information from the model
    await BookingInfo.fetchAll().then((alldatarows) => {
      console.log('================ GET ALL BOOKING DATA ===============');
      // Render the EJS view with the booking data
      res.render('reservationsearch', {
        confirmationData: alldatarows,
        pageTitle: 'All Reservations',
        path: '/reservationsearch',
        UsingSearchFunction: false,
      });
    });
  } catch (error) {
    console.log('Error fetching bookings:', error);
    next(error);
    return null;
  }
};

//Filter reservations by guest name
exports.getFilteredBookings = async (req, res, next) => {
  const guestName = req.body.guestName;
  console.log(
    '================ GET FILTER WITH KEYWORDS ' +
      guestName +
      ' ==============='
  );
  try {
    // Filter booking information based on guest name
    BookingInfo.filterByGuestName(guestName).then((filteredBookings) => {
      if (
        !filteredBookings ||
        typeof filteredBookings === 'undefined' ||
        filteredBookings.length === 0
      ) {
        res.render('reservationsearch', {
          confirmationData: null,
          pageTitle: 'Filtered Reservations',
          path: '/getAllBookings',
          UsingSearchFunction: true,
          keywords: guestName,
        });
      } else {
        res.render('reservationsearch', {
          confirmationData: filteredBookings,
          pageTitle: 'Filtered Reservations',
          path: '/getAllBookings',
          UsingSearchFunction: true,
          keywords: guestName,
        });
      }
    });
  } catch (error) {
    console.log('Error filtering bookings:', error);
    next(error);
  }
};

// handle GET request to go to booking page
exports.getBookingInfo = (req, res, next) => {
  //get booking info for confirmation
  const bookingInfo = BookingInfo.fetchAll();
  res.render('bookingconfirmation', {
    confirmationData: bookingInfo,
    pageTitle: 'Booking Confirmation Page',
    path: '/bookingconfirmation',
    hasInfo: bookingInfo.length > 0,
  });
};

// handle POSt request to save booking data
exports.postAddBookingData = async (req, res, next) => {
  let tableDetails = { tableType: '' };
  switch (req.body.tableType) {
    case '0':
      tableDetails.tableType = 'Two-seater Table';
      break;
    case '1':
      tableDetails.tableType = 'Four-seater Table';
      break;
    case '2':
      tableDetails.tableType = 'Six-seater Table';
      break;
    case '3':
      tableDetails.tableType = 'Large Group Table';
      break;
    default:
      tableDetails.tableType = 'Not Selected';
  }

  // Create booking object with only the fields from the restaurant booking form
  const booking = new BookingInfo(
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.phone,
    req.body.numberOfGuests,
    formatDate(req.body.date),
    req.body.time,
    tableDetails.tableType,
    req.body.specialRequests || null // Make special requests optional
  );

  try {
    console.log(booking);
    const bookingId = await booking.save();
    if (!bookingId) {
      return res.render('roombooking', {
        hasErrorInsertedData: true,
        pageTitle: 'Restaurant Booking',
        path: '/bookingform',
      });
    }
    console.log(bookingId);
    const bookingRow = await BookingInfo.fetchById(bookingId);
    console.log(bookingRow);
    res.render('bookingconfirmation', {
      confirmationData: bookingRow,
      pageTitle: 'Booking Confirmation Page',
      path: '/bookingconfirmation',
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.render('roombooking', {
      hasErrorInsertedData: true,
      pageTitle: 'Restaurant Booking',
      path: '/bookingform',
    });
  }
};

function formatDate(date) {
  const d = new Date(date);
  let year = d.getFullYear();
  let month = ('0' + (d.getMonth() + 1)).slice(-2); // Month from 0-11, so add 1
  let day = ('0' + d.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
}
