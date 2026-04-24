const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getInventory)
  .post(createInventoryItem);

router.route('/low-stock')
  .get(getLowStockItems);

router.route('/:id')
  .get(getInventoryItem)
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

module.exports = router;