# Panda Restaurant Website

![Restaurant Preview](panda_restaurant.gif)

A modern, full-featured restaurant website built with Node.js and Express, featuring a responsive design and dynamic content management.

## Features

- Responsive design that works on desktop and mobile devices
- Dynamic content rendering with EJS templating
- Modern UI with animated components
- About us section with restaurant information
- CSS animations and transitions for enhanced user experience
- Error handling middleware
- Static file serving for images, CSS, and other assets

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templating)
- CSS3 with animations
- Bootstrap
- Materialize CSS
- MySQL2 for database operations

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)
- MySQL Server

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pandarestaurant
```

2. Install dependencies:
```bash
npm install
```

# Environment Configuration

1. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
JWT_SECRET=your_jwt_secret
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
```

## Configure the database
  

   - Run the database setup script:
   ```bash
   mysql -u your_username -p < seed.sql
   ```
   This will create the database and required tables for the application.

   - Start the development server:
   ```bash
   npm run start
   ```

   The application will be available at `http://localhost:3000`