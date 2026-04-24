const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
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
  getMessages,
} = require("../controllers/vetController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.get("/", getVets);
router.post("/apply", applyAsVet);
router.get("/profile/me", getMyVetProfile);
router.put("/profile/me", updateMyVetProfile);
router.put("/availability", updateAvailability);
router.get("/admin/applications", authorize("admin"), getPendingApplications);
router.put("/admin/applications/:id", authorize("admin"), reviewApplication);
router.get("/consultations", getConsultations);
router.post("/consultations", createConsultation);
router.put("/consultations/:id", updateConsultation);
router.get("/consultations/incoming", getIncomingConsultations);
router.put("/consultations/:id/respond", respondToConsultation);
router.get("/consultations/:id/messages", getMessages);
router.post("/consultations/:id/messages", upload.single("media"), sendMessage);
router.get("/:id", getVet);

module.exports = router;
