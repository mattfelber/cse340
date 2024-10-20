const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
  return await pool.query(sql, [classification_name]);
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventoryItem(vehicle) {
  const sql = `
    INSERT INTO public.inventory 
    (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
  const params = [
    vehicle.inv_make,
    vehicle.inv_model,
    vehicle.inv_description,
    vehicle.inv_image,
    vehicle.inv_thumbnail,
    vehicle.inv_price,
    vehicle.inv_year,
    vehicle.inv_miles,
    vehicle.inv_color,
    vehicle.classification_id
  ];
  return await pool.query(sql, params);
}

/* ***************************
 *  Get a vehicle by its ID
 * ************************** */
async function getVehicleById(id) {
  const sql = 'SELECT * FROM inventory WHERE inv_id = $1'; // Ensure consistency here
  const data = await pool.query(sql, [id]);
  return data.rows[0]; // Assuming rows[0] contains the specific vehicle
}

/* ***************************
 *  Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classificationId) {
  const sql = 'SELECT * FROM inventory WHERE classification_id = $1';
  const data = await pool.query(sql, [classificationId]);
  return data.rows; // Returns the rows that match the classificationId
}

// Export all functions properly
module.exports = { 
  getClassifications, 
  addClassification, 
  addInventoryItem, 
  getVehicleById,
  getInventoryByClassificationId 
};
