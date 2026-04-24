const express = require('express');
const router = express.Router();
const {
  getReminders,
  getUpcomingReminders,
  createReminder,
  updateReminder,
  completeReminder,
  deleteReminder
} = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.route('/upcoming')
  .get(getUpcomingReminders);

router.route('/:id')
  .put(updateReminder)
  .delete(deleteReminder);

router.route('/:id/complete')
  .put(completeReminder);

module.exports = router;