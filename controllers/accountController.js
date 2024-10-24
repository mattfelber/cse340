const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

// Render the account management view
const renderAccountManagement = (req, res) => {
  const user = utilities.getUserData(req.cookies.jwt);
  if (!user) return res.redirect("/account/login");

  res.render("account/management", {
    title: "Account Management",
    firstName: user.firstName,
    accountType: user.accountType,
    accountId: user.id,
    loggedIn: true,
  });
};

// Render the update account view
const getUpdateView = async (req, res) => {
  try {
    const account = await accountModel.getAccountById(req.params.id);
    res.render("account/update", {
      title: "Update Account",
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      accountId: account.accountId,
    });
  } catch (error) {
    res.render("account/update", {
      title: "Update Account",
      error: "Unable to load account details.",
    });
  }
};

// Handle account update
const updateAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, accountId } = req.body;
    await accountModel.updateAccount({ firstName, lastName, email, accountId });
    res.redirect("/account/management");
  } catch (error) {
    res.render("account/update", {
      title: "Update Account",
      error: "Unable to update account. Please try again.",
      firstName,
      lastName,
      email,
      accountId,
    });
  }
};

// Handle password change
const changePassword = async (req, res) => {
  try {
    const { newPassword, accountId } = req.body;
    const hashedPassword = accountModel.hashPassword(newPassword); // Hash the new password
    await accountModel.updatePassword(hashedPassword, accountId);
    res.redirect("/account/management");
  } catch (error) {
    res.render("account/update", {
      title: "Update Account",
      error: "Unable to change password. Please try again.",
      accountId,
    });
  }
};

// Handle logout
const logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

// Render the login view
const renderLoginView = (req, res) => {
  res.render("account/login", {
    title: "Login",
    errors: [],
  });
};

module.exports = { 
  renderAccountManagement, 
  getUpdateView, 
  updateAccount, 
  changePassword, 
  logout,
  renderLoginView 
};
