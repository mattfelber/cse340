// utilities/auth-middleware.js
const jwt = require("jsonwebtoken");

const checkAccountType = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.redirect("/account/login");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    // Allow only Admin or Employee types
    if (decodedToken.accountType !== "Admin" && decodedToken.accountType !== "Employee") {
      req.flash("error", "Access denied.");
      return res.redirect("/account/login");
    }

    next();
  } catch (error) {
    res.redirect("/account/login");
  }
};

module.exports = { checkAccountType };
