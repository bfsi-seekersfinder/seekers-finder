import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminRole:String,
    adminName:String,
    adminEmail:String,
    adminContact:Number,
    notification:[{
        notificationType:String,
        headLine:String,
        message:String,
        queryMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"reqService"
        },
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"RecruiterTalent"
        },
        refrence:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"newtesting2"
        },
        refrenceAnother:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Candidate"
        }],
        details: { 
            recruiterName: String,
            contactNo: String,
            email: String,
            companyName: String,
            designation: String,
            location: String
        },
        seen:{
            type:Boolean,
            default:false
        },
        createdAt:{
            type:Date,
            default: Date.now()
        },

        }],
    block:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RecruiterTalent"
    }],
    password:String,
})

const admin = new mongoose.model('talentxAdmin', adminSchema)
export default admin;