/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/account'); 
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

/* ***********************
 * Middleware for Handling Form Data
 *************************/
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

/* ***********************
 * Setup Flash Messages and Session
 *************************/
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());
app.use(cookieParser());

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Static Routes
 *************************/
app.use(static); // Serve static files from public

/* ***********************
 * Inventory Routes
 *************************/
app.use('/inv', inventoryRoute); // Inventory routes with /inv prefix

/* ***********************
 * Account Routes
 *************************/
app.use('/account', accountRoute); 

// Index route
app.get("/", baseController.buildHome);

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  let nav = await require("./utilities").getNav();

  // Check if the user is logged in and get the user's first name
  let loggedIn = false;
  let userFirstName = "";
  if (req.cookies && req.cookies.jwt) {
    const userData = require("./utilities").getUserData(req.cookies.jwt);
    if (userData) {
      loggedIn = true;
      userFirstName = userData.account_firstname;
    }
  }

  res.status(500).render("error", { 
    title: "Server Error",
    nav,
    message: err.message || "An unknown error occurred.",
    loggedIn,
    userFirstName
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
  console.log(`http://${host}:${port}`);
});
