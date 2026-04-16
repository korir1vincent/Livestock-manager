const express = require('express');
const router = express.Router();
const {
  getVets,
  getVet,
  applyAsVet,
  getMyVetProfile,
  updateMyVetProfile,
  updateAvailability,
  getPendingApplications,
  reviewApplication,
  createConsultation,
  getConsultations,
  getIncomingConsultations,
  respondToConsultation,
  updateConsultation,
  sendMessage,
  getMessages
} = require('../controllers/vetController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Public vet listing
router.get('/', getVets);

// Vet application
router.post('/apply', applyAsVet);

// Vet own profile
router.get('/profile/me', getMyVetProfile);
router.put('/profile/me', updateMyVetProfile);
router.put('/availability', updateAvailability);

// Admin routes
router.get('/admin/applications', authorize('admin'), getPendingApplications);
router.put('/admin/applications/:id', authorize('admin'), reviewApplication);

// Farmer consultations
router.get('/consultations', getConsultations);
router.post('/consultations', createConsultation);
router.put('/consultations/:id', updateConsultation);

// Vet incoming consultations
router.get('/consultations/incoming', getIncomingConsultations);
router.put('/consultations/:id/respond', respondToConsultation);

// Chat
router.get('/consultations/:id/messages', getMessages);
router.post('/consultations/:id/messages', sendMessage);

// Single vet (keep last to avoid catching other routes)
router.get('/:id', getVet);

module.exports = router;