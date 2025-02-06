import express from "express";
import userModel from '../schema/user.mongoose.js'
import bfsiModel from '../schema/userdata.mongoose.js'
const router = express.Router()

router.get('/api/userdata', async (req, res)=>{
    try{

        const { jobProfile, keywords, experience, minSalary, maxSalary, jobType, datePosted, limit, skip } = req.query;
        const filterConditions = {};

    if (jobProfile) {
        filterConditions.jobProfile = { $in: jobProfile.split(",") }; // Assuming jobProfile is an array
    }
    if (keywords) {
        filterConditions.keywords = { $in: keywords.split(",") };
    }
    if (experience) {
        filterConditions.experience = { $in: experience.split(",") };
    }
    if (minSalary || maxSalary) {
        filterConditions.salary = {};
        if (minSalary) filterConditions.salary.$gte = minSalary;
        if (maxSalary) filterConditions.salary.$lte = maxSalary;
    }
    if (jobType) {
        filterConditions.jobType = { $in: jobType.split(",") };
    }
    if (datePosted) {
        filterConditions.datePosted = { $gte: new Date(datePosted) }; // Assuming datePosted is a specific date
    }
        const totalDocument = await userModel.countDocuments(filterConditions)
        const userData = await userModel.find(filterConditions)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        
        res.json({userData, totalDocument})
    }catch(err){
        console.log(err.message)
        res.status(500).send('server err')
    }
});

router.get('/api/user', async (req, res)=>{

    const {limit, skip} = req.query;

    const totalDocument = await bfsiModel.countDocuments()
    const newData = await bfsiModel.find()
    .skip(parseInt(skip))
    .limit(parseInt(limit))

    res.json({newData, totalDocument})
})
export default router;