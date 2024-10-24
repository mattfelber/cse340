const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');  // For password hashing

const Util = {}; 

Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
    list += "</ul>";
    return list;
  } catch (error) {
    return "<ul><li><a href='/'>Home</a></li></ul>";
  }
};

// JWT Token Utilities
Util.getUserData = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Password hash utility using crypto
Util.hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

Util.verifyPassword = (inputPassword, storedHash) => {
  const hashedInput = crypto.createHash('sha256').update(inputPassword).digest('hex');
  return hashedInput === storedHash;
};

/* ************************
 * Middleware to verify JWT and user role
 ************************ */
Util.verifyJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("error", "You must be logged in to view this page.");
    return res.redirect("/account/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.flash("error", "Invalid or expired token. Please log in again.");
    return res.redirect("/account/login");
  }
};

// Middleware to check user role (Admin or Employee)
Util.checkUserRole = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.accountType)) {
      next();
    } else {
      req.flash("error", "You do not have permission to access this area.");
      return res.redirect("/");
    }
  };
};

module.exports = Util;
