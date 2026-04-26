const express = require("express");
const router = express.Router();
const {
  createScan,
  getScans,
  getScan,
  deleteScan,
  analyzeImage,
} = require("../controllers/scanController");
const { protect } = require("../middleware/auth");
const scanUpload = require("../middleware/scanUpload");

router.use(protect);

router.route("/").get(getScans).post(createScan);

router.post("/analyze", scanUpload.single("image"), analyzeImage);

router.route("/:id").get(getScan).delete(deleteScan);

module.exports = router;
