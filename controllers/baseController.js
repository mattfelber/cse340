const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();

    let loggedIn = false;
    let userFirstName = "";
    if (req.cookies && req.cookies.jwt) {
      const userData = utilities.getUserData(req.cookies.jwt);
      if (userData) {
        loggedIn = true;
        userFirstName = userData.account_firstname; // Get first name from JWT data
      }
    }

    res.render("index", {
      title: "Home",
      nav,
      loggedIn, 
      userFirstName
    });
  } catch (error) {
    next(error);
  }
};

module.exports = baseController;
