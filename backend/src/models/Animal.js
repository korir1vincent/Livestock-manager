const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["Checkup", "Vaccination", "Treatment", "Surgery", "Other"],
    required: true,
  },
  diagnosis: String,
  treatment: String,
  medications: [String],
  veterinarian: String,
  notes: String,
  cost: Number,
});

const animalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Animal name is required"],
      trim: true,
    },
    tagId: {
      type: String,
      required: [true, "Tag ID is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Animal type is required"],
      enum: ["Cattle", "Goat", "Sheep", "Pig", "Poultry", "Other"],
    },
    breed: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      min: 0,
    },
    color: String,
    healthStatus: {
      type: String,
      enum: ["Healthy", "Sick", "Under Treatment", "Quarantine"],
      default: "Healthy",
    },
    pregnancyStatus: {
      type: String,
      enum: ["Not Pregnant", "Pregnant", "Recently Calved"],
      default: "Not Pregnant",
    },
    purchaseDate: Date,
    purchasePrice: Number,
    currentValue: Number,
    motherTagId: String,
    fatherTagId: String,
    image: String,
    vaccinations: [
      {
        name: String,
        date: Date,
        nextDue: Date,
      },
    ],
    healthRecords: [healthRecordSchema],
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
animalSchema.index({ userId: 1, tagId: 1 }, { unique: true });
animalSchema.index({ userId: 1, type: 1 });
animalSchema.index({ userId: 1, healthStatus: 1 });

// Virtual for age calculation
animalSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

module.exports = mongoose.model("Animal", animalSchema);
