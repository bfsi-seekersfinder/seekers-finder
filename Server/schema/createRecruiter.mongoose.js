import mongoose from "mongoose";
import Candidate from "./userdata.mongoose.js";
import User from "./user.mongoose.js";

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
    planActive:{
        type:Boolean,
        default:false
    },
    limit:{
        type:Number,
        required:true,
    },
    startedAt:{
        type:Date,
        default:Date.now()
    },
    expireAt:{
        type:Date,
        default:null
    },
    totalView:{
        type:Number,
    },
    pastLimits: [{
            value: {
                type:Number
            }, 
            changedAt: { 
                type: Date, 
                default: Date.now
            }
        }],
    aliasUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"aliasUser"
    }],
    savedProfile:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newtesting2"
    }],
    savedProfileAnother:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Candidate'
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
    block:{
        type:Boolean,
        default:false
    },
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
