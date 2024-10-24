// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const { classValidate, invValidate } = require("../utilities/inventory-validations"); 

// Routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/management", utilities.verifyJWT, utilities.checkUserRole(['Admin', 'Employee']), utilities.handleErrors(invController.buildManagement)); // Restricted to Admin and Employee
router.get("/add-classification", utilities.verifyJWT, utilities.checkUserRole(['Admin', 'Employee']), utilities.handleErrors(invController.buildAddClassification));

// Update classification validation references
router.post("/add-classification", 
  utilities.verifyJWT, 
  utilities.checkUserRole(['Admin', 'Employee']), 
  classValidate.rules(), 
  classValidate.checkData, 
  utilities.handleErrors(invController.addClassification)
);

// Update inventory validation references
router.get("/add-inventory", utilities.verifyJWT, utilities.checkUserRole(['Admin', 'Employee']), utilities.handleErrors(invController.buildAddInventory));
router.post(
  "/add-inventory",
  utilities.verifyJWT, 
  utilities.checkUserRole(['Admin', 'Employee']),
  invValidate.rules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
