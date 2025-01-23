-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pandaRestaurant;
USE pandaRestaurant;

-- Create single BOOKING table with guest information
CREATE TABLE IF NOT EXISTS BOOKING (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    number_of_guests INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    table_type ENUM('Two-seater Table', 'Four-seater Table', 'Six-seater Table', 'Large Group Table') NOT NULL,
    special_requests TEXT,
    status ENUM('Confirmed', 'Cancelled', 'Completed') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (number_of_guests > 0 AND number_of_guests <= 12)
);
