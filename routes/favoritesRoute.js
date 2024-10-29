const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const authMiddleware = require('../middleware/auth'); // Example authentication middleware

router.get('/', authMiddleware, favoritesController.getFavorites);

// Route to add a favorite
router.post('/add', favoritesController.addFavorite);

// Route to view all favorites for a user
router.get('/', favoritesController.getFavorites);

// Route to remove a favorite
router.delete('/remove', favoritesController.removeFavorite);

module.exports = router;
