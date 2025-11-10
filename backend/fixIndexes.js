import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const col = mongoose.connection.collection("users");

  try {
    await col.dropIndex("email_1");
    console.log("✅ Dropped email_1 index");
  } catch (e) {
    console.log("⚠️ email_1 index not found");
  }

  try {
    await col.dropIndex("mobile_1");
    console.log("✅ Dropped mobile_1 index");
  } catch (e) {
    console.log("⚠️ mobile_1 index not found");
  }

  await col.updateMany({ email: null }, { $unset: { email: "" } });
  await col.updateMany({ mobile: null }, { $unset: { mobile: "" } });
  console.log("✅ Cleaned up null email/mobile fields");

  await mongoose.disconnect();
  console.log("✨ Done! Restart your server now.");
};

run();
