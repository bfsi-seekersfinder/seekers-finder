import mongoose from "mongoose";
const MONGO_URI = "mongodb://localhost:27017/BanksterIndiaUseData";
const connectDB = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("bfsi database Connected Successfully!");
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      process.exit(1); // Stop the app if the database connection fails
    }
  };

  export default connectDB;