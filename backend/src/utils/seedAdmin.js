import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Portal Admin";

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
}

const existing = await User.findOne({ email });

if (existing) {
  console.log(`Admin already exists: ${email}`);
} else {
  await User.create({ name, email, password });
  console.log(`Admin created: ${email}`);
}

process.exit(0);
