const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const bookingController = require('../controllers/bookingController');

const router = express.Router();

// ============================= HANDLE GET REQUESTS FROM CLIENT ====================
// handle to redirect to main page
router.get('/', (req, res, next) => {
  console.log('Redirect to main page');
  res.render('index', {
    pageTitle: 'The Bike Hotel',
    path: '/',
  });
});

// handle to redirect to booking page
router.get('/bookingform', (req, res, next) => {
  console.log('Redirect to booking page');
  res.render('tablebooking', {
    hasErrorInsertedData: false,
    pageTitle: 'Table Booking',
    path: '/bookingform',
  });
  // res.sendFile(path.join(rootDir, 'views', 'roombooking.html'));
});

// handle to redirect to contact page
router.get('/contactus', (req, res, next) => {
  console.log('Redirect to contact page');
  res.render('contact-us', {
    pageTitle: 'Contact Us',
    path: '/contactus',
  });
});

// handle to redirect to about us page
router.get('/aboutus', (req, res, next) => {
  console.log('Redirect to about us page');
  res.render('about-us', {
    pageTitle: 'About Us',
    path: '/aboutus',
  });
});

// get booking confirmation information
router.get(
  '/getConfirmationInfomation',
  bookingController.getBookingInfo.bind(bookingController)
);

// handle to redirect to booking page
router.get(
  '/getAllBookings',
  bookingController.getAllBookings.bind(bookingController)
);

// ============================= HANDLE POST REQUESTS FROM CLIENT ====================

//send user inputs in booking inform to the booking controller
router.post(
  '/add-bookinginfo',
  bookingController.postAddBookingData.bind(bookingController)
);

// handle to redirect to booking page
router.post(
  '/filter-reservations',
  bookingController.getFilteredBookings.bind(bookingController)
);

module.exports = router;
