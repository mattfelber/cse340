const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const classValidate = {};
const invValidate = {};

/* ******************************
 * Add Classification Validation Rules
 * ****************************** */
classValidate.rules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters long.")
      .isAlphanumeric()
      .withMessage("Classification name can only contain letters and numbers.")
  ];
};

/* ******************************
 * Check Classification Data
 * ****************************** */
classValidate.checkData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities/").getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    });
    return;
  }
  next();
};

/* ******************************
 * Add Inventory Validation Rules
 * ****************************** */
invValidate.rules = () => {
  return [
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Model must be at least 3 characters long."),
    body("inv_year").isInt({ min: 1886 }).withMessage("Year must be a valid number."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a valid number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive number."),
    body("classification_id").notEmpty().withMessage("Classification must be selected."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

/* ******************************
 * Check Inventory Data
 * ****************************** */
invValidate.checkData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities/").getNav();
    let classificationList = await require("../utilities/").buildClassificationList(req.body.classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: errors.array(),
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_color: req.body.inv_color,
    });
    return;
  }
  next();
};

module.exports = { classValidate, invValidate };
