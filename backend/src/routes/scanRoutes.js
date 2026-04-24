const express = require('express');
const router = express.Router();
const {
  createScan,
  getScans,
  getScan,
  deleteScan,
  analyzeImage
} = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getScans)
  .post(createScan);

router.route('/analyze')
  .post(analyzeImage);

router.route('/:id')
  .get(getScan)
  .delete(deleteScan);

module.exports = router;