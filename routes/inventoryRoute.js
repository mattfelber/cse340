// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const { classValidate, invValidate } = require("../utilities/inventory-validations"); // Use correct import

// Routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/management", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Update classification validation references
router.post("/add-classification", 
  classValidate.rules(), // Ensure correct method call
  classValidate.checkData,
  utilities.handleErrors(invController.addClassification)
);

// Update inventory validation references
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", 
  invValidate.rules(), // Ensure correct method call
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
