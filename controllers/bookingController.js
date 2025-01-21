const BookingInfo = require('../models/BookingModel');

// get all reservations data 
exports.getAllBookings = async (req, res, next) => {
  try {
    // Get all booking information from the model
    await BookingInfo.fetchAll().then(alldatarows => {
      console.log("================ GET ALL BOOKING DATA ===============");
      // Render the EJS view with the booking data
      res.render('reservationsearch', {
        confirmationData: alldatarows,
        pageTitle: 'All Reservations',
        path: '/reservationsearch',
        UsingSearchFunction: false
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
  console.log("================ GET FILTER WITH KEYWORDS " + guestName + " ===============");
  try {
    // Filter booking information based on guest name
    BookingInfo.filterByGuestName(guestName).then(filteredBookings => {
      if (!filteredBookings || typeof filteredBookings === 'undefined' || filteredBookings.length === 0) {
        res.render('reservationsearch', {
          confirmationData: null,
          pageTitle: 'Filtered Reservations',
          path: '/getAllBookings',
          UsingSearchFunction: true,
          keywords: guestName
        });
      } else {
        res.render('reservationsearch', {
          confirmationData: filteredBookings,
          pageTitle: 'Filtered Reservations',
          path: '/getAllBookings',
          UsingSearchFunction: true,
          keywords: guestName
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
    hasInfo: bookingInfo.length > 0
  });
};

// handle POSt request to save booking data
exports.postAddBookingData = async (req, res, next) => {
  let roomDetails = { roomType: "", price: 0 };
  switch (req.body.roomType) {
    case "0":
      roomDetails.roomType = "Standard Room";
      roomDetails.price = 150;
      break;
    case "1":
      roomDetails.roomType = "Family Room";
      roomDetails.price = 350;
      break;
    case "2":
      roomDetails.roomType = "Private Room";
      roomDetails.price = 400;
      break;
    case "3":
      roomDetails.roomType = "Mix Dorm Room";
      roomDetails.price = 450;
      break;
    case "4":
      roomDetails.roomType = "Female Dorm Room";
      roomDetails.price = 520;
      break;
    case "5":
      roomDetails.roomType = "Male Dorm Room";
      roomDetails.price = 520;
      break;
    default:
      roomDetails.roomType = "Not Selected";
      roomDetails.price = 0;
  }
  // hander user inputs and call model for storing into an array
  const userbooking = new BookingInfo(req.body.firstName, req.body.lastName, req.body.email,
    req.body.phone, req.body.address, req.body.city, req.body.state, roomDetails.roomType, roomDetails.price, req.body.numberOfChildren, req.body.numberOfAdults, formatDate(req.body.arrivalDate), req.body.arrivalTime, req.body.arrivalsessionOfDayArrival, req.body.departureDate, req.body.departureTime, req.body.departuresessionOfDayDeparture, req.body.cardNumber, req.body.expirationDate, req.body.cvv, req.body.postalCode, req.body.specialRequests);

  // get the booking id from the new data
  await userbooking.save().then(async bookingId => {
    if (bookingId === null) {
      res.render('roombooking', {
        hasErrorInsertedData: true,
        pageTitle: 'Room Booking',
        path: '/bookingform'
      });
    } else {
      // Fetch only the booking that was just saved
      const bookingrow = await BookingInfo.fetchById(bookingId);
      console.log("booking row nek");
      console.log(bookingrow);
      //return data
      res.render('bookingconfirmation', {
        confirmationData: bookingrow,
        pageTitle: 'Booking Confirmation Page',
        path: '/bookingconfirmation'
      });
    }
  })
    .catch(error => {
      console.error("Error saving booking:", error);
      res.render('roombooking', {
        hasErrorInsertedData: true,
        pageTitle: 'Room Booking',
        path: '/bookingform'
      });
    });;
};

function formatDate(date) {
  const d = new Date(date);
  let year = d.getFullYear();
  let month = ('0' + (d.getMonth() + 1)).slice(-2);  // Month from 0-11, so add 1
  let day = ('0' + d.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
}

