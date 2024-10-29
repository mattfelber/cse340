const db = require('../database'); // Adjust based on your path to the database connection file

// Function to add an item to favorites
exports.addFavorite = async (userId, invId) => {
    const query = 'INSERT INTO favorites (user_id, inv_id) VALUES ($1, $2) RETURNING *';
    try {
        const result = await db.query(query, [userId, invId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw new Error('Database error');
    }
};

// Function to get all favorite items for a user
exports.getFavoritesByUser = async (userId) => {
    const query = `SELECT inv.* FROM inventory inv
                   JOIN favorites fav ON inv.inv_id = fav.inv_id
                   WHERE fav.user_id = $1`;
    try {
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw new Error('Database error');
    }
};

// Function to remove a favorite item
exports.removeFavorite = async (userId, invId) => {
    const query = 'DELETE FROM favorites WHERE user_id = $1 AND inv_id = $2 RETURNING *';
    try {
        const result = await db.query(query, [userId, invId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw new Error('Database error');
    }
};
