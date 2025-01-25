-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pandaRestaurant;
USE pandaRestaurant;

-- Create BOOKING table with guest information
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

-- Create USERS table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create MENU_ITEMS table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample menu items
INSERT INTO menu_items (name, price) VALUES
('Spring Rolls', 6.99),
('Kung Pao Chicken', 15.99),
('Sweet and Sour Pork', 14.99),
('Mapo Tofu', 12.99),
('Peking Duck', 29.99),
('Dim Sum Platter', 18.99),
('Hot and Sour Soup', 5.99),
('Chow Mein', 11.99);

-- Insert a default users (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@pandarestaurant.com', '$2a$12$4Q0YzoHJGXGlj1m8hyBgA.Hlpdh1Gx6c8qQuDIkyUnmXKDC0H02QW', 'Admin', 'User', 'admin'),
('customer@example.com', '$2a$12$4Q0YzoHJGXGlj1m8hyBgA.Hlpdh1Gx6c8qQuDIkyUnmXKDC0H02QW', 'John', 'Smith', 'customer');
