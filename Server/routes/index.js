import express from "express";
import userModel from '../schema/user.mongoose.js'
const router = express.Router()


router.get('/api/user', async (req, res)=>{
    try{

        const { 
            jobProfile, 
            keywords, 
            excludekeys, 
            minExperience,
            maxExperience, 
            profileName, 
            location, 
            education,
            compony,
            product,
            designation,
            noticePeriod, 
            gender, 
            minSalary, 
            maxSalary,  
            limit, 
            skip 
        } = req.query;

        const filterConditions = {};
        
        if (Array.isArray(jobProfile) && jobProfile.length > 0) {
            filterConditions["$and"] = jobProfile.map(name => ({
                '$or': [
                    { fullName: { $regex: new RegExp(name, "i") } },
                    { "workExperience.name": { $regex: new RegExp(name, "i") } },
                    { "workExperience.designation": { $regex: new RegExp(name, "i") } },
                    { "workExperience.description": { $regex: new RegExp(name, "i") } },
                    { "userLocation.country": { $regex: new RegExp(`^${name}$`, "i") } },
                    { "userLocation.state": { $regex: new RegExp(`^${name}$`, "i") } },
                    { "userLocation.city": { $regex: new RegExp(`^${name}$`, "i") } },
                    { noticePeriod: { $regex: new RegExp(name, "i") } },
                    { product: { $regex: new RegExp(name, "i") } },
                    { "education.name": { $regex: new RegExp(name, "i") } },
                    { "education.universityName": { $regex: new RegExp(name, "i") } }
            ]
            }));
        }
        
        if (Array.isArray(keywords) && keywords.length > 0) {
            filterConditions["$or"] = keywords.map(name => ({
                "$or": [
                    { fullName: { $regex: new RegExp(name, "i") } },
                    { "workExperience.name": { $regex: new RegExp(name, "i") } },
                    { "workExperience.designation": { $regex: new RegExp(name, "i") } },
                    { "workExperience.description": { $regex: new RegExp(name, "i") } },
                    { "userLocation.country": { $regex: new RegExp(name, "i") } },
                    { "userLocation.state": { $regex: new RegExp(name, "i") } },
                    { "userLocation.city": { $regex: new RegExp(name, "i") } },
                    { noticePeriod: { $regex: new RegExp(name, "i") } },
                    { product: { $regex: new RegExp(name, "i") } },
                    { "education.name": { $regex: new RegExp(name, "i") } },
                    { "education.universityName": { $regex: new RegExp(name, "i") } }
                ]
            }));
        }

        if (Array.isArray(excludekeys) && excludekeys.length > 0) {
            filterConditions["$or"] = keywords.map(name => ({
                "$or": [
                    { fullName: { $regex: new RegExp(name, "i") } },
                    { "workExperience.name": { $regex: new RegExp(name, "i") } },
                    { "workExperience.designation": { $regex: new RegExp(name, "i") } },
                    { "workExperience.description": { $regex: new RegExp(name, "i") } },
                    { "userLocation.country": { $regex: new RegExp(name, "i") } },
                    { "userLocation.state": { $regex: new RegExp(name, "i") } },
                    { "userLocation.city": { $regex: new RegExp(name, "i") } },
                    { noticePeriod: { $regex: new RegExp(name, "i") } },
                    { product: { $regex: new RegExp(name, "i") } },
                    { "education.name": { $regex: new RegExp(name, "i") } },
                    { "education.universityName": { $regex: new RegExp(name, "i") } }
                ]
            }));
        }

        if(Array.isArray(location) && location.length>0){
            filterConditions["$or"] = location.flatMap(locat=>[
                {"userLocation.city" : {$regex: new RegExp(locat, "i")}},
                {"userLocation.state": {$regex: new RegExp(locat, "i")}}
            ])
        }

        if (Array.isArray(product) && product.length > 0) {
            filterConditions["$or"] = product.map(prod => ({
                product: { $regex: new RegExp(`^${prod}$`, "i") }
            }));
        }   

        if (Array.isArray(noticePeriod) && noticePeriod.length > 0) {
            filterConditions["$or"] = noticePeriod.map(notice => ({
                noticePeriod: { $regex: new RegExp(`^${notice}$`, "i") }
            }));
        }        
        
        if (Array.isArray(compony) && compony.length > 0) {
            filterConditions["workExperience"] = {
                $elemMatch: {
                    name: { $regex: new RegExp(`^${compony}$`, "i") }
                }
            };
        }
        if (Array.isArray(designation) && designation.length > 0) {
            filterConditions["workExperience"] = {
                $elemMatch: {
                    designation: { $regex: new RegExp(`^${designation}$`, "i") }
                }
            };
        }

        if (Array.isArray(gender)) {
            const validGenders = gender
                .map(g => g.trim().toLowerCase())
                .filter(g => g === "male" || g === "female") 
                .map(g => g.charAt(0).toUpperCase() + g.slice(1));
        
            if (validGenders.length > 0) {
                filterConditions.gender = { $in: validGenders };
            }
        }
        
        if(minExperience || maxExperience){
            filterConditions.yearsOfExperience = {}

            if(minExperience){
                filterConditions.yearsOfExperience.$gte = Number(minExperience);
            }
            if(maxExperience){
                filterConditions.yearsOfExperience.$lte = Number(maxExperience);
            }
        }

        if (Array.isArray(education) && education.length > 0) {
            filterConditions["$or"] = education.flatMap(edu => ([
                { "education.name": { $regex: new RegExp(`^${edu.trim()}$`, "i") } }, // Exact match
                { "education.universityName": { $regex: new RegExp(`^${edu.trim()}$`, "i") } } // Exact match
            ]));
        }

        if(profileName){
            filterConditions.fullName = {
                $regex: new RegExp(profileName, "i")
            }
        }

        if (minSalary || maxSalary) {
            filterConditions.currentCtc = {};

            if (minSalary) filterConditions.currentCtc.$gte = Number(minSalary);
            if (maxSalary) filterConditions.currentCtc.$lte = Number(maxSalary);
        }   

        const totalDocument = await userModel.countDocuments(filterConditions)
        const newData = await userModel.find(filterConditions)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        res.json({newData, totalDocument})
    }catch(err){
        console.log(err.message)
        res.status(500).send('server err')
    }
})

export default router;