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

  const saltRound = 10
  const hashedPass = await bcrypt.hash("admin@123", saltRound)
  const insertAdmin = async () => {
    try {
      const newAdmin = new admin({
        adminRole: "Super Admin",
        adminName: "Bankster India",
        adminEmail: "talentx@gmail.com",
        adminContact: 6546546654,
        notification: [{message: "Welcome Admin", headLine:"Welcome Admin"}],
        password:hashedPass
      });
  
      const savedAdmin = await newAdmin.save();
      console.log("Admin inserted successfully:", savedAdmin);
      mongoose.connection.close(); // Close the connection after insert
    } catch (error) {
      console.error("Error inserting admin:", error);
    }
  };
  

  // insertAdmin()


  // const finder = admin.find({ "notification.refrence": { $exists: true }, "notification.refrenceModel": { $exists: false } })
// console.log(finder)
// admin.updateMany(
//   { "notification.refrence": { $exists: true }, "notification.refrenceModel": { $exists: false } },
//   { $set: { "notification.$[].refrenceModel": "newtesting2" } }  
// )


  export default connectDB;
  