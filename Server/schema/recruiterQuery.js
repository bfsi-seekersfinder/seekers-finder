import mongoose from "mongoose";

const recruiterQuery = new mongoose.Schema({
    recruiterName:String,
    email:String,
    contactNo:Number,
    companyName:String,
    designation:String,
    location:String,
    queries:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const reqService = new mongoose.model("reqService", recruiterQuery);
export default reqService;