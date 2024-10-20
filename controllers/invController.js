// Import necessary modules and utilities
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; // Create an empty controller object

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagement = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); // Get navigation bar
    res.render("./inventory/management", {
      title: "Vehicle Management", // Set page title
      nav, // Pass the navigation bar to the view
    });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); // Get navigation bar
    res.render("./inventory/add-classification", {
      title: "Add Classification", // Set page title
      nav, // Pass the navigation bar to the view
    });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};

/* ***************************
 *  Process Adding New Classification
 * ************************** */
invCont.addClassification = async (req, res, next) => {
  const { classification_name } = req.body; // Extract the classification name from the form submission
  try {
    // Attempt to add the classification
    await invModel.addClassification(classification_name);
    req.flash("message", "Classification added successfully!");
    res.redirect("/inv/management");
  } catch (error) {
    let nav = await utilities.getNav();
    // Re-render the view with an errors array if something goes wrong
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Failed to add classification. Please try again." }],
      classification_name // Preserve entered classification name on failure
    });
  }
};

/* ***************************
 *  Process Adding New Inventory Item
 * ************************** */
invCont.addInventory = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    // Add inventory item using the model function
    await invModel.addInventoryItem({
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    });
    req.flash("message", "Vehicle added successfully!");
    res.redirect("/inv/management");
  } catch (error) {
    req.flash("error", "Failed to add vehicle. Please try again.");
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);

    res.render("./inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: [{ msg: "Failed to add vehicle. Please try again." }],
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }
};

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); // Get navigation bar
    let classificationList = await utilities.buildClassificationList(); // Get the classification dropdown list
    res.render("./inventory/add-inventory", {
      title: "Add Inventory Item", // Set page title
      nav, // Pass the navigation bar to the view
      classificationList, // Pass the classification dropdown list to the view
      inv_make: "",        // Provide default empty values
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image.png",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
      errors: [], // Initialize errors array to prevent undefined errors
    });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory by inventory view (Vehicle Details View)
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    const data = await invModel.getVehicleById(inv_id); // Updated function call
    const vehicleDetail = utilities.buildVehicleDetail(data); // HTML built in utility
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: data.inv_make + " " + data.inv_model, // Display vehicle make and model
      nav,
      vehicleDetail,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont; // Export the controller object
