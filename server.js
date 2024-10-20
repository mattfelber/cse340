/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute')
const session = require('express-session');
const flash = require('connect-flash');

/* ***********************
 * Middleware for Handling Form Data
 *************************/
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

/* ***********************
 * Setup Flash Messages and Session
 *************************/
app.use(session({
  secret: 'secret-key', // Replace 'secret-key' with your own secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") 

/* ***********************
 * Static Routes
 *************************/
app.use(static); // Serve static files from public

/* ***********************
 * Inventory Routes
 *************************/
app.use('/inv', inventoryRoute); // Inventory routes with /inv prefix

// Index route
app.get("/", baseController.buildHome)

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  let nav = await require("./utilities").getNav();
  res.status(500).render("error", { 
    title: "Server Error",
    nav, // Include nav
    message: err.message || "An unknown error occurred." // Pass a default error message
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
  console.log(`http://${host}:${port}`)
})
