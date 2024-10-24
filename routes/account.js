const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const { validate, logValidate } = require("../utilities/account-validation");

router.get("/login", accountController.renderLoginView); // Route for login
router.get("/management", accountController.renderAccountManagement);
router.get("/update/:id", accountController.getUpdateView);
router.post("/update", validate.registrationRules(), validate.checkRegData, accountController.updateAccount);
router.post("/change-password", logValidate.loginRules(), logValidate.checkLoginData, accountController.changePassword);
router.get("/logout", accountController.logout);

module.exports = router;
