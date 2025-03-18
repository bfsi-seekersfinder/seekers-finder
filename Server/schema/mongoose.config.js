import mongoose from "mongoose";
import admin from "./admin.mongoose.js";
import bcrypt from 'bcrypt'
const sessionModel = mongoose.connection.collection("sessions");


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {maxPoolSize: 10,});
      console.log("MongoDB Connected Successfully!");
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    }
  };

  

  export default connectDB;
  