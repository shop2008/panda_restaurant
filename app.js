// include express, path and body-parser modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// define express server object
const server = express();

// to use 'ejs' templating engine for dynamic contents
server.set('view engine', 'ejs');
// server.set('views', 'views');
server.set('views', path.join(__dirname, 'views'));

// to parse body
server.use(bodyParser.urlencoded({ extended: false }));

// to serve static css files in the public directory.
server.use(express.static(path.join(__dirname, 'public')));
server.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Internal Server Error');
});

//========== update for using controller
// define route objects
const indexRoutes = require('./routes/index');

// to register the routes in the server
server.use(indexRoutes);

// start the server at specific port at the localhost
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


