// backend/src/controllers/financialController.js
const Expense = require('../models/Expense');
const Revenue = require('../models/Revenue');

// @desc    Get all expenses
// @route   GET /api/financial/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    let query = { userId: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (category) query.category = category;

    const expenses = await Expense.find(query)
      .populate('animalId', 'name tagId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create expense
// @route   POST /api/financial/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      userId: req.user._id
    };

    const expense = await Expense.create(expenseData);

    res.status(201).json({
      success: true,
      expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update expense
// @route   PUT /api/financial/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/financial/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get financial summary
// @route   GET /api/financial/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find({
      userId: req.user._id,
      ...dateQuery
    });

    const revenues = await Revenue.find({
      userId: req.user._id,
      ...dateQuery
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0);
    
    const expensesByCategory = {};
    expenses.forEach(exp => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalExpenses,
        totalRevenue,
        netProfit: totalRevenue - totalExpenses,
        expensesByCategory,
        transactionCount: {
          expenses: expenses.length,
          revenues: revenues.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all revenues
// @route   GET /api/financial/revenues
// @access  Private
exports.getRevenues = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const revenues = await Revenue.find(query)
      .populate('animalId', 'name tagId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: revenues.length,
      revenues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create revenue
// @route   POST /api/financial/revenues
// @access  Private
exports.createRevenue = async (req, res) => {
  try {
    const revenueData = {
      ...req.body,
      userId: req.user._id
    };

    const revenue = await Revenue.create(revenueData);

    res.status(201).json({
      success: true,
      revenue
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};