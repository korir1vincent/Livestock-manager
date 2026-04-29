const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getRevenues,
  createRevenue,
  generateReport,
} = require("../controllers/financialController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/expenses").get(getExpenses).post(createExpense);

router.route("/expenses/:id").put(updateExpense).delete(deleteExpense);

router.route("/revenues").get(getRevenues).post(createRevenue);

router.route("/summary").get(getSummary);
router.post("/report", generateReport);

module.exports = router;
