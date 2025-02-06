import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    location: { type: String, },
    currentCompany: { type: String, },
    currentDesignation: { type: String, },
    product: { type: String, },
    experience: { type: String, },
    currentCTC: { type: String, },
    noticePeriod: { type: String, },
    FullName: { type: String, },
    phoneNumber: { type: Number,  },
    email: { type: String, },
    gender: { type: String }
});

const User = mongoose.model('USERDATA', userSchema, 'USERDATA');

export default User