import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB Atlas connection error:", error);
    process.exit(1); // Stop the app if there's a connection error
  }
};

export default connectDB;
