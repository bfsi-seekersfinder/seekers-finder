import mongoose from "mongoose";
const MONGO_URI = "mongodb+srv://user_001:usermongodb@production.cb9f8gz.mongodb.net/bankster?retryWrites=true&w=majority&appName=Production";


const connectDB = async () => {
    try {
      await mongoose.connect(MONGO_URI, {maxPoolSize: 10,});
      console.log("MongoDB Connected Successfully!");
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    }
  };

  export default connectDB;
  