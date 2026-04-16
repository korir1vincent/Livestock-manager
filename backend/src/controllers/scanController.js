// backend/src/controllers/scanController.js
const Scan = require('../models/Scan');

// @desc    Create new scan
// @route   POST /api/scan
// @access  Private
exports.createScan = async (req, res) => {
  try {
    const scanData = {
      ...req.body,
      userId: req.user._id
    };

    const scan = await Scan.create(scanData);

    res.status(201).json({
      success: true,
      scan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user scans
// @route   GET /api/scan
// @access  Private
exports.getScans = async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user._id })
      .populate('animalId', 'name tagId type')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: scans.length,
      scans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single scan
// @route   GET /api/scan/:id
// @access  Private
exports.getScan = async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('animalId', 'name tagId type');

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.status(200).json({
      success: true,
      scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete scan
// @route   DELETE /api/scan/:id
// @access  Private
exports.deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    await scan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Scan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Analyze image (mock AI analysis)
// @route   POST /api/scan/analyze
// @access  Private
exports.analyzeImage = async (req, res) => {
  try {
    // This is a mock response. In production, you would integrate with an actual AI service
    const mockAnalysis = {
      livestock: 'Cattle (Holstein Cow)',
      confidence: 0.87,
      healthStatus: 'Moderate Concern',
      condition: 'Possible Respiratory Infection',
      symptoms: [
        'Nasal discharge observed',
        'Slightly elevated temperature indicators',
        'Reduced activity level'
      ],
      recommendations: [
        {
          type: 'Immediate Action',
          items: [
            'Isolate animal from herd',
            'Monitor temperature twice daily',
            'Ensure adequate hydration'
          ]
        },
        {
          type: 'Medication',
          items: [
            'Oxytetracycline 20mg/kg - Administer intramuscularly once daily for 3-5 days',
            'Flunixin Meglumine 2.2mg/kg - For fever and inflammation',
            'Vitamin B Complex - Support immune system'
          ]
        },
        {
          type: 'Nutrition',
          items: [
            'High-quality hay',
            'Fresh water ad libitum',
            'Electrolyte supplements',
            'Reduce grain temporarily'
          ]
        },
        {
          type: 'Monitoring',
          items: [
            'Check temperature morning and evening',
            'Observe eating and drinking habits',
            'Monitor breathing rate',
            'Document any changes'
          ]
        }
      ],
      vetConsultRequired: true,
      severity: 'Medium'
    };

    res.status(200).json({
      success: true,
      analysis: mockAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};