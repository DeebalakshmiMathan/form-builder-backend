import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB Atlas connected successfully!");

  } catch (error) {
  console.error("MongoDB connection failed:");
  console.error(error);
  process.exit(1);
}
};

export default connectDB;