import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
    role: { 
        type: String, 
        required: true 
    },
    
    recruiterName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    contactNo:{
        type:Number,
    },
    location:{
        state:String,
        city:String,
        landMark:String,
    },
    currentCompany:{
        type:String,
    },
    currentDesignation:{
        type:String,
    },
    PAN:{
        type:String,
    },
    GST:{
        type:String,
    },
    TAN:{
        type:String,
    },
    plan:{
        type:String
    },
    limit:{
        type:Number,
        required:true
    },
    totalView:{
        type:Number,
    },
    pastLimits:[{
        type:Number
    }],
    aliasUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"aliasUser"
    }],
    savedProfile:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newtesting2"
    }],
    savedSearches:[{
        header:String,
        filters:Object,
        createdAt: { type: Date, default: Date.now }
    }],
    viewedProfile:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newtesting2"
    }],
    notification:[{
        type:String,
    }],
    OTP:{
        type:Number
    },
    otpExpiry: { 
        type: Date, 
        default: null 
    }

}, { timestamps: true });

const Recruiter = mongoose.model("RecruiterTalent", recruiterSchema);
export default Recruiter;
