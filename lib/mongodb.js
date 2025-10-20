import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in .env");

  try {
    const db = await mongoose.connect(uri);
    isConnected = true;
    console.log("MongoDB connected:", db.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
