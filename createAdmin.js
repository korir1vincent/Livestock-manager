const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    // FORCE clean connection
    await mongoose.disconnect().catch(() => {});

    await mongoose.connect("mongodb://127.0.0.1:27017/Mifugo-App", {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Connected cleanly");

    const User = require("./backend/src/models/User");

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = await User.create({
      name: "System Admin",
      email: "admin@mifugo.com",
      password: hashedPassword,
      farmLocation: "Head Office",
      role: "admin"
    });

    console.log("🎉 Admin created:", admin.email);

    await mongoose.disconnect();
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();