const favoritesModel = require('../models/favoritesModel');

exports.addFavorite = async (req, res) => {
    const { invId } = req.body;
    const userId = req.user.account_id;  // Adjust based on your session data

    try {
        const favorite = await favoritesModel.addFavorite(userId, invId);
        res.status(200).json({ message: 'Added to favorites', favorite });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to favorites' });
    }
};

exports.getFavorites = async (req, res) => {
    const userId = req.user.account_id;

    try {
        const favorites = await favoritesModel.getFavoritesByUser(userId);
        res.render('favorites', { favorites });  // Adjust if necessary to fit your rendering setup
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve favorites' });
    }
};

exports.removeFavorite = async (req, res) => {
    const { invId } = req.body;
    const userId = req.user.account_id;

    try {
        const removedFavorite = await favoritesModel.removeFavorite(userId, invId);
        res.status(200).json({ message: 'Removed from favorites', removedFavorite });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from favorites' });
    }
};
