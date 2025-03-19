import mongoose from 'mongoose'

const aliasUserSchema = new mongoose.Schema({
    aliasRole:String,
    aliasName:String,
    aliasEmail:String,
    aliasContactNo:Number,
    aliasPassword:String,
    limit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RecruiterTalent"
    },
    recruiterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RecruiterTalent"
    },
    cvsCount:Number,
    cvsDownload:Number,
    loginHistory:[{
        type:Date,
        default:Date.now()
    }],
    logoutHistory:[{
        type:Date,
        default:Date.now()
    }],
    block:{type:Boolean, default:false},
    suspend:{
        type:Boolean, default:false
    },
    createdAT:{
        type:Date,
        default:Date.now()
    }

})

const aliasUser = mongoose.model("aliasUser", aliasUserSchema)
export default aliasUser;