import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobileNo:Number,
    email:String,
    gender:String,
    workExperience:[{
        name:String,
        designation:String,
        description:String,
    }],
    product:String,
    yearsOfExperience: { type: Number},
    noticePeriod: { type: String,  },
    currentCtc: { type: String, },
    previousCompanies: [{ type: String }], 
    education: [{
        name:String,
        universityName:String,
     }],
    userLocation: {
        country: { type: String, default: "India" },
        state: { type: String },
        city: { type: String },
    },  
    maritalStatus:String,
    skills: [{ type: String }],
    cv: [{ type: String }],
      
}, {timestamps: true});

const User = mongoose.model('newtesting2', userSchema);

export default User;