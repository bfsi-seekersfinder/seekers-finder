import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:String,
    type:String
}) 

const product = mongoose.model("jobparams", productSchema)
export default product;