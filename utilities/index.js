const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ***************************
 *  Build Classification Grid HTML
 * ************************** */
Util.buildClassificationGrid = function(data) {
  let grid;
  if (data.length > 0) {
    grid = '<div class="classification-grid">';
    data.forEach(vehicle => {
      grid += `
        <div class="vehicle-card">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <p>Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)}</p>
          <a href="/inv/detail/${vehicle.inventory_id}" class="btn">View Details</a>
        </div>
      `;
    });
    grid += '</div>';
  } else {
    grid = '<p>No vehicles found for this classification.</p>';
  }
  return grid;
};

/* ***************************
 *  Build vehicle detail HTML
 * ************************** */
Util.buildVehicleDetail = function(vehicle) {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p>Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)}</p>
      <p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
      <p>Color: ${vehicle.inv_color}</p>
      <p>Description: ${vehicle.inv_description}</p>
    </div>
  `;
};

/* ***************************
 *  Error Handling Middleware
 * ************************** */
Util.handleErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* ***************************
 *  Export Utility Functions
 * ************************** */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildVehicleDetail: Util.buildVehicleDetail,
  handleErrors: Util.handleErrors
};
