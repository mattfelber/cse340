const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

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

module.exports = invCont;