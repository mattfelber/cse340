const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get a vehicle by its ID
 * ************************** */
async function getVehicleById(id) {
  const sql = 'SELECT * FROM inventory WHERE inventory_id = $1';
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
  getVehicleById,
  getInventoryByClassificationId // Add this to export the function
};
