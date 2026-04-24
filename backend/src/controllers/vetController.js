const Vet = require("../models/Vet");
const User = require("../models/User");
const Consultation = require("../models/Consultation");

// @desc    Get all approved vets
// @route   GET /api/vet
// @access  Private
exports.getVets = async (req, res) => {
  try {
    const vets = await Vet.find({
      isActive: true,
      approvalStatus: "approved",
    }).sort({ rating: -1 });
    res.status(200).json({ success: true, count: vets.length, vets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single vet
// @route   GET /api/vet/:id
// @access  Private
exports.getVet = async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet)
      return res.status(404).json({ success: false, message: "Vet not found" });
    res.status(200).json({ success: true, vet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply to become a vet (farmer submits application)
// @route   POST /api/vet/apply
// @access  Private
exports.applyAsVet = async (req, res) => {
  try {
    const existing = await Vet.findOne({ userId: req.user._id });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already submitted a vet application",
        });
    }

    const vet = await Vet.create({
      ...req.body,
      userId: req.user._id,
      email: req.user.email,
      name: req.user.name,
      approvalStatus: "pending",
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Application submitted. Awaiting admin approval.",
        vet,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get vet's own profile
// @route   GET /api/vet/profile/me
// @access  Private (vet only)
exports.getMyVetProfile = async (req, res) => {
  try {
    const vet = await Vet.findOne({ userId: req.user._id });
    if (!vet)
      return res
        .status(404)
        .json({ success: false, message: "Vet profile not found" });
    res.status(200).json({ success: true, vet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vet's own profile
// @route   PUT /api/vet/profile/me
// @access  Private (vet only)
exports.updateMyVetProfile = async (req, res) => {
  try {
    const vet = await Vet.findOneAndUpdate({ userId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vet)
      return res
        .status(404)
        .json({ success: false, message: "Vet profile not found" });
    res.status(200).json({ success: true, vet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update vet availability
// @route   PUT /api/vet/availability
// @access  Private (vet only)
exports.updateAvailability = async (req, res) => {
  try {
    const vet = await Vet.findOneAndUpdate(
      { userId: req.user._id },
      { availability: req.body.availability },
      { new: true },
    );
    if (!vet)
      return res
        .status(404)
        .json({ success: false, message: "Vet profile not found" });
    res.status(200).json({ success: true, vet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────

// @desc    Get all pending vet applications
// @route   GET /api/vet/admin/applications
// @access  Private (admin only)
exports.getPendingApplications = async (req, res) => {
  try {
    const vets = await Vet.find({ approvalStatus: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: vets.length, vets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject a vet application
// @route   PUT /api/vet/admin/applications/:id
// @access  Private (admin only)
exports.reviewApplication = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Status must be approved or rejected",
        });
    }

    const vet = await Vet.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status, approvalNote: note },
      { new: true },
    );

    if (!vet)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    if (status === "approved") {
      await User.findByIdAndUpdate(vet.userId, { role: "vet" });
    }

    res
      .status(200)
      .json({ success: true, message: `Application ${status}`, vet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── CONSULTATIONS ───────────────────────────────────────────────────────────

// @desc    Book a consultation (farmer)
// @route   POST /api/vet/consultations
// @access  Private
exports.createConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.create({
      ...req.body,
      userId: req.user._id,
      status: "Pending",
    });
    res.status(201).json({ success: true, consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get farmer's own consultations
// @route   GET /api/vet/consultations
// @access  Private
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user._id })
      .populate("vetId", "name specialty")
      .populate("animalId", "name tagId type")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vet's incoming consultations
// @route   GET /api/vet/consultations/incoming
// @access  Private (vet only)
exports.getIncomingConsultations = async (req, res) => {
  try {
    const vet = await Vet.findOne({ userId: req.user._id });
    if (!vet)
      return res
        .status(404)
        .json({ success: false, message: "Vet profile not found" });

    const consultations = await Consultation.find({ vetId: vet._id })
      .populate("userId", "name email")
      .populate("animalId", "name tagId type")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Vet accepts or rejects a consultation
// @route   PUT /api/vet/consultations/:id/respond
// @access  Private (vet only)
exports.respondToConsultation = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Accepted", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Status must be Accepted or Rejected",
        });
    }

    const vet = await Vet.findOne({ userId: req.user._id });
    if (!vet)
      return res
        .status(404)
        .json({ success: false, message: "Vet profile not found" });

    const consultation = await Consultation.findOneAndUpdate(
      { _id: req.params.id, vetId: vet._id },
      { status },
      { new: true },
    );

    if (!consultation)
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });

    res.status(200).json({ success: true, consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update consultation (farmer or vet)
// @route   PUT /api/vet/consultations/:id
// @access  Private
exports.updateConsultation = async (req, res) => {
  try {
    let consultation = await Consultation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!consultation)
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });

    consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(200).json({ success: true, consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── CHAT ────────────────────────────────────────────────────────────────────

// @desc    Send a message (text or media) in a consultation
// @route   POST /api/vet/consultations/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res
        .status(400)
        .json({ success: false, message: "Message text or media is required" });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation)
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });

    const vet = await Vet.findOne({ userId: req.user._id });
    const isVet = vet && consultation.vetId.toString() === vet._id.toString();
    const isFarmer = consultation.userId.toString() === req.user._id.toString();

    if (!isVet && !isFarmer) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Build media URL if file uploaded
    let mediaUrl = null;
    let mediaType = null;
    if (file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      mediaUrl = `${baseUrl}/uploads/chat/${file.filename}`;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";
    }

    const message = {
      senderId: req.user._id,
      senderRole: isVet ? "vet" : "farmer",
      text: text || "",
      mediaUrl,
      mediaType,
    };

    consultation.messages.push(message);
    if (consultation.status === "Accepted") consultation.status = "In Progress";
    await consultation.save();

    res.status(201).json({
      success: true,
      message: consultation.messages[consultation.messages.length - 1],
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for a consultation
// @route   GET /api/vet/consultations/:id/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate(
      "messages.senderId",
      "name",
    );

    if (!consultation)
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });

    const vet = await Vet.findOne({ userId: req.user._id });
    const isVet = vet && consultation.vetId.toString() === vet._id.toString();
    const isFarmer = consultation.userId.toString() === req.user._id.toString();

    if (!isVet && !isFarmer) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, messages: consultation.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
