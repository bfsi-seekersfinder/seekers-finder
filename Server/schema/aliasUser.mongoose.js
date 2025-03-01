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
    }

})

const aliasUser = mongoose.model("aliasUser", aliasUserSchema)
export default aliasUser;