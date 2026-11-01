import "dotenv/config";
import mongoose from "mongoose";
import Admin from "./models/Admin.js";

const createSuperAdmin = async () => {
    const fullName = process.env.ADMIN_FULL_NAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const phoneNumber = process.env.ADMIN_PHONE_NUMBER?.trim() || "";

    if (!fullName || !email || !password) {
        throw new Error(
            "ADMIN_FULL_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured."
        );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("ADMIN_EMAIL must be a valid email address.");
    }

    if (password.length < 12) {
        throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be configured.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    if (await Admin.exists({})) {
        throw new Error(
            "Administrator accounts already exist; provisioning will not modify them."
        );
    }

    await Admin.create({
        fullName,
        email,
        password,
        phoneNumber,
        role: "super_admin",
        isActive: true,
    });

    console.log("Initial Super Admin account created.");
};

try {
    await createSuperAdmin();
} catch (error) {
    console.error("Super Admin provisioning failed:", error.message);
    process.exitCode = 1;
} finally {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
}
