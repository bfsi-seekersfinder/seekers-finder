import mongoose from 'mongoose'

const aliasUserSchema = new mongoose.Schema({
    aliasRole:String,
    aliasName:String,
    aliasEmail:String,
    aliasContactNo:Number,
    aliasPassword:String,
    limit:{
        type:mongoose.Schema.Types.ObjectID,
        ref:"RecruiterTalent"
    },
    recruiterId:{
        type:mongoose.Schema.Types.ObjectID,
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
    block:Boolean,
    createdAT:{
        type:Date,
        default:Date.now()
    }

})

const aliasUser = mongoose.model("aliasUser", aliasUserSchema)
export default aliasUser;