const express = require('express');
const router = express.Router();
const {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getStats,
  addHealthRecord
} = require('../controllers/animalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAnimals)
  .post(createAnimal);

router.route('/stats')
  .get(getStats);

router.route('/:id')
  .get(getAnimal)
  .put(updateAnimal)
  .delete(deleteAnimal);

router.route('/:id/health')
  .post(addHealthRecord);

module.exports = router;