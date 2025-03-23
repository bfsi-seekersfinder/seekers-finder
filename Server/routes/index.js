import express, { json } from "express";
import bcrypt from "bcrypt"
import userModel from '../schema/user.mongoose.js'
import Candidate from "../schema/userdata.mongoose.js";
import productModule from "../schema/product.mongoose.js";
import recruiterModule from "../schema/createRecruiter.mongoose.js";
import aliasUserModel from "../schema/aliasUser.mongoose.js";
import forgotPassword from "../controlers/forgotPassword.js";
import resetPassword from "../controlers/resetPassword.js";
import verifyOTP from "../controlers/verifyOTP.js";

const router = express.Router()



const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    next();
};


router.get('/api/user',  async (req, res) => {
    try {
        const { 
            jobProfile, keywords, excludekeywords, 
            minExperience, maxExperience,
            state, city, profileName, ug, pg,
            Compony, Product, designation, noticePeriod, 
            gender, minSalary, maxSalary,
            limit, skip 
        } = req.query;

        const skipValue = Math.max(Number(skip) || 0, 0);
        const limitValue = Math.max(Number(limit/2) || 10, 0);
        
        let query = {};

        if (Array.isArray(jobProfile) && jobProfile.length > 0) {
            query["$and"] = jobProfile.map(name => ({
                "$or": [
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
            query["$or"] = keywords.map(name => ({
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

        if (Array.isArray(excludekeywords) && excludekeywords.length > 0) {
            query["$nor"] = excludekeywords.flatMap(name => ([
                { fullName: { $regex: new RegExp(name, "i") } },
                { "workExperience.name": { $regex: new RegExp(name, "i") } },
                { "workExperience.designation": { $regex: new RegExp(name, "i") } },
                { "workExperience.description": { $regex: new RegExp(name, "i") } },
                { "userLocation.country": { $regex: new RegExp(name, "i") } },
                { "userLocation.state": { $regex: new RegExp(name, "i") } },
                { "userLocation.city": { $regex: new RegExp(name, "i") } },
                { noticePeriod: { $regex: new RegExp(name, "i") } },
                { product: { $regex: new RegExp(name, "i") } },
                { currentCtc: { $regex: new RegExp(name, "i") } },
                { "education.name": { $regex: new RegExp(name, "i") } },
                { "education.universityName": { $regex: new RegExp(name, "i") } }
            ]));
            if (excludekeywords.includes("Male") || excludekeywords.includes("Female")) {
                query["$nor"].push({ gender: { $in: excludekeywords } });
            }
        }

        if (state) {
            query["userLocation.state"] = { $regex: new RegExp(state, "i") }; 
        }

        if (city) {
            query["userLocation.city"] = { $regex: new RegExp(city, "i") };       
        }

        if (Product && Product.length > 0) {
            query.product = { $in: Product };
        }

        if (noticePeriod) {
            query.noticePeriod = { $regex: new RegExp(noticePeriod, "i") };
        }        

        if (Array.isArray(Compony) && Compony.length > 0) {
            query["$or"] = Compony.map(company => ({
                "workExperience.name": { $regex: new RegExp(`^${company}$`, "i") }
            }));
        }

        if (Array.isArray(designation) && designation.length > 0) {
            query["workExperience"] = {
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
                query.gender = { $in: validGenders };
            }
        }

        if(minExperience || maxExperience) {
            query.yearsOfExperience = {};
            if(minExperience) query.yearsOfExperience.$gte = Number(minExperience);
            if(maxExperience) query.yearsOfExperience.$lte = Number(maxExperience);
        }

        if (ug || pg) {
            query["education.name"] = {
                $in: [...(ug ? [ug] : []), ...(pg ? [pg] : [])]
            };
        }

        if (profileName) {
            query["$or"] = [
                { fullName: { $regex: new RegExp(profileName, "i") } },
                {email:{$regex: new RegExp(profileName, "i")}}
            ];
        
            if (!isNaN(profileName) && profileName.trim() !== "") {
                query["$or"].push({ mobileNo: Number(profileName) });
            }
        }

        if (minSalary || maxSalary) {
            query.currentCtc = {};
            if (minSalary) query.currentCtc.$gte = Number(minSalary);
            if (maxSalary) query.currentCtc.$lte = Number(maxSalary);
        }

        const totalUserDocs = await userModel.countDocuments(query);
        const paginatedData = await userModel.find(query).skip(skipValue).limit(limitValue);
        
        const totalCandidates = await Candidate.countDocuments(query);
        const paginatedCandidateData = await Candidate.find(query).skip(skipValue).limit(limitValue);

        
        const totalDocument = totalUserDocs + totalCandidates
        const combinedData = [...paginatedData, ...paginatedCandidateData]

        res.json({success:true, newData: combinedData, totalDocument });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/api/product", async (req, res) => {
    try {
      const products = await productModule.find({ type: "product" });
      const funcArea = await productModule.find({ type: "industry" });
      const ug = await productModule.find({ type: "ug" }); 
      const pg = await productModule.find({ type: "pg" }); 
  
      res.json({
        products,
        funcArea,
        ug,
        pg
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
      console.error(error.message);
    }
});

router.get('/api/recruiter',  async (req, res) => {
    try {
        const { SearchRecruiter } = req.query;
        let query = {};
        if (SearchRecruiter) {
        query = {
        $or: [
            { name: { $regex: SearchRecruiter, $options: "i" } },
            { email: { $regex: SearchRecruiter, $options: "i" } },
            { currentCompany: { $regex: SearchRecruiter, $options: "i" } },

        ]
            };
        }
        const recruiters = await recruiterModule.find(query);
        const totalRecruiter = await recruiterModule.countDocuments()
        const activePlan = await recruiterModule.find({planActive:true})
        const totalActives = activePlan.length
        if (!recruiters.length) {
        return res.json({ message: "No recruiters found!" });
        }

        res.json({ recruiters, totalRecruiter, totalActives });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

});

router.post("/api/recruiters/create-recruiter",  async (req, res) => {
    try {
        const {
            role, 
            plan,
            recruiterName, 
            email,
            contactNo,
            password, 
            limit,
            startDate,
            expireDate,
            state,
            city,
            landMark,
            currentCompany, 
            currentDesignation,  
            PAN,
            GST,
            TAN,
            aliasUsers, 
        } = req.body;

        if (!role || !recruiterName || !email || !password || !limit) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if email already exists
        const existingEmail = await recruiterModule.findOne({ email });
        if (existingEmail) {
        return res.status(400).json({ message: "User already exists" });
        }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        const newRecruiter = new recruiterModule({
            role,
            plan,
            planActive:true,
            recruiterName,
            email,
            contactNo,
            limit,
            pastLimits:{value:limit, changedAt: Date.now()},
            startedAt:startDate,
            expireAt:expireDate,
            location:{
                city:city,
                state:state,
                landMark:landMark,
            },
            currentCompany, 
            currentDesignation,  
            PAN,
            GST,
            TAN,
            password: hashedPassword,
            aliasUsers: [] 
        });

        await newRecruiter.save();


        if(plan==="corporate") {

        let aliasUserIds = [];
        if (Array.isArray(aliasUsers) && aliasUsers.length) {
            try {
                const aliasUsersWithHashedPasswords = await Promise.all(
                aliasUsers.map(async (alias) => {
                const hashedAliasPassword = await bcrypt.hash(alias.aliasPassword, saltRound);
                return {
                aliasRole: alias.aliasRole,
                aliasName: alias.aliasName,
                aliasEmail: alias.aliasEmail,
                aliasContactNo: alias.aliasContactNo,
                aliasPassword: hashedAliasPassword,  
                recruiterId: newRecruiter._id,
                limit: newRecruiter._id
                };
                })
                );

                const createdAliases = await aliasUserModel.insertMany(aliasUsersWithHashedPasswords);
                aliasUserIds = createdAliases.map(alias => alias._id);
            } catch (aliasError) {
                await recruiterModule.findByIdAndDelete(newRecruiter._id);
                return res.json({ message: "Failed to create alias users", error: aliasError.message });
                
            }
        }

        newRecruiter.aliasUsers = aliasUserIds;
        await newRecruiter.save();
    }

    res.json({ success: true, message: "New User Created" });

    } catch (error) {
        res.json({ message: "Try after an Hours", error: error.message });
    }

});


router.put("/api/recruiters/update/:recruiterId", async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const {
            role,
            plan,
            recruiterName,
            email,
            contactNo,
            password,
            limit,
            startDate,
            expireDate,
            state,
            landMark,
            city,
            currentCompany,
            currentDesignation,
            PAN,
            GST,
            TAN,
            aliasUsers, // New alias users
        } = req.body;

        // Find existing recruiter
        let recruiter = await recruiterModule.findById(recruiterId);

        if (!recruiter) {
        return res.status(404).json({ message: "Recruiter not found" });
        }


        // Update recruiter details
        recruiter.role = role || recruiter.role;
        recruiter.plan = plan || recruiter.plan;
        recruiter.recruiterName = recruiterName || recruiter.recruiterName;
        recruiter.email = email || recruiter.email;
        recruiter.contactNo = contactNo || recruiter.contactNo;
        recruiter.limit = limit || recruiter.limit;
        recruiter.pastLimits.push({value:limit, changedAt: Date.now()}),
        recruiter.startedAt = startDate || recruiter.startedAt,
        recruiter.expireAt = expireDate || recruiter.expireAt,
        recruiter.location.state = state || recruiter.location.state;
        recruiter.location.city = city || recruiter.location.city;
        recruiter.location.landMark = landMark || recruiter.location.landMark;
        recruiter.currentCompany = currentCompany || recruiter.currentCompany;
        recruiter.currentDesignation = currentDesignation || recruiter.currentDesignation;
        recruiter.PAN = PAN || recruiter.PAN;
        recruiter.GST = GST || recruiter.GST;
        recruiter.TAN = TAN || recruiter.TAN;
        recruiter.viewedProfile = [];
        recruiter.savedProfile = [];
        recruiter.planActive = true,
        recruiter.block = false

        if (password) {
        const saltRound = 10;
        recruiter.password = await bcrypt.hash(password, saltRound);
        }

        if (plan === "corporate" && Array.isArray(aliasUsers) && aliasUsers.length) {

        let aliasUserIds = [];
        try {
        const aliasUsersWithHashedPasswords = await Promise.all(
        aliasUsers.map(async (alias) => {
            const hashedAliasPassword = await bcrypt.hash(alias.aliasPassword, 10);
            return {
            aliasRole: alias.aliasRole,
            aliasName: alias.aliasName,
            aliasEmail: alias.aliasEmail,
            aliasContactNo: alias.aliasContactNo,
            aliasPassword: hashedAliasPassword,
            recruiterId: recruiter._id,
            limit: recruiter._id
            };
        })
        );

        const createdAliases = await aliasUserModel.insertMany(aliasUsersWithHashedPasswords);
        aliasUserIds = createdAliases.map(alias => alias._id);

        recruiter.aliasUsers.push(...aliasUserIds);
        } catch (aliasError) {
        return res.status(500).json({ message: "Failed to add alias users", error: aliasError.message });
        }
    }else{

        const aliasUsersToBlock = await aliasUserModel.find({ _id: { $in: recruiter.aliasUsers } });

    // ✅ Step 2: Update their `block` field to true
        if (aliasUsersToBlock.length > 0) {
        await aliasUserModel.updateMany(
            { _id: { $in: recruiter.aliasUsers } },
            { $set: { suspend: true } }
        );
    }  
    }

        await recruiter.save();

        res.json({ success: true, message: "Recruiter updated successfully" });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

router.post("/api/create/candidate",  async (req, res) => {
    try {

      const { 
        fullName, 
        mobileNo, 
        email, 
        gender, 
        product,
        yearsOfExperience, 
        currentCompany, 
        noticePeriod, 
        currentCtc, 
        maritalStatus, 
        skills, 
        workExperience, education, userLocation } = req.body;


      const newCandidate = new userModel({
        fullName,
        mobileNo: Number(mobileNo),
        email,
        gender,
        product,
        yearsOfExperience: Number(yearsOfExperience),
        currentCompany,
        noticePeriod,
        currentCtc,
        maritalStatus,
        skills,
        workExperience, 
        education, 
        userLocation,
      });

  
      await newCandidate.save();
  
      res.status(201).json({ success: true, message: "Candidate created successfully!" });
    } catch (error) {
      console.error("Error creating candidate:", error.message);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });

  router.put("/api/update/candidate/:id", async (req, res) => {
    try {
        const candidateId = req.params.id;
        const {
            fullName,
            mobileNo,
            email,
            gender,
            product,
            yearsOfExperience,
            noticePeriod,
            currentCtc,
            designation,
            workExperience,
            education,
            userLocation,
            maritalStatus,
            skills,
        } = req.body;

        const existingCandidate = await userModel.findById(candidateId);
        if (!existingCandidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        // Update fields only if they exist in the request
        if (fullName) existingCandidate.fullName = fullName;
        if (mobileNo) existingCandidate.mobileNo = mobileNo;
        if (email) existingCandidate.email = email;
        if (gender) existingCandidate.gender = gender;
        if (product) existingCandidate.product = product;
        if (yearsOfExperience) existingCandidate.yearsOfExperience = yearsOfExperience;
        if (noticePeriod) existingCandidate.noticePeriod = noticePeriod;
        if (currentCtc) existingCandidate.currentCtc = currentCtc;
        if (designation) existingCandidate.designation = designation;
        if (userLocation) existingCandidate.userLocation = userLocation;
        if (maritalStatus) existingCandidate.maritalStatus = maritalStatus;

        if (Array.isArray(workExperience)) {
            existingCandidate.workExperience.unshift(...workExperience);
        }
        
        if (Array.isArray(education)) {
            existingCandidate.education.unshift(...education);
        }
        
        if (Array.isArray(skills)) {
            existingCandidate.skills.unshift(...skills);
        }
        
        


        const updatedCandidate = await existingCandidate.save();

        res.status(200).json({ success: true, message: "Candidate updated successfully!", data: updatedCandidate });
    } catch (error) {
        console.error("Error updating candidate:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }


});

router.get("/api/get/candidate", async (req, res) => {
    try {
      const { candidate } = req.query;
  
      let query = {};
  
      if (candidate) {
        query = {
          $or: [
            { fullName: { $regex: candidate, $options: "i" } },
            { email: { $regex: candidate, $options: "i" } },
            { currentCompany: { $regex: candidate, $options: "i" } }
          ]
        };
  
        // Check if the candidate is a valid number before querying `mobileNo`
        if (!isNaN(candidate)) {
          query.$or.push({ mobileNo: Number(candidate) });
        }
      }
  
      const candidates = await userModel.find(query).limit(15);
  
      if (candidates.length === 0) {
        return res.status(404).json({ success: false, message: "No candidates found" });
      }
  
      res.status(200).json({ success: true, candidates });
  
    } catch (error) {
      console.error("Error fetching candidates:", error.message);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });

router.post("/api/account/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
        return res.status(400).json({ message: "All fields are required." });
        }
        let user = await recruiterModule.findOne({ email: username }).populate(["savedProfile", "aliasUsers"])

        if(!user){
            user = await aliasUserModel.findOne({aliasEmail:username}).populate("limit");
        }

        if (!user) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        if(!user ) {
        return res.status(404).json({message: "Email not vallid !"})
        }

        let isMatch = null
        if(user.role === 'recruiter'){
         isMatch = await bcrypt.compare(password, user.password);
        }
        else{
            isMatch = await bcrypt.compare(password, user.aliasPassword)
        }

        if (!isMatch) {
        return res.status(400).json({ message: "Incorrect Password."});
        }

        if(user?.role === 'recruiter'){
            req.session.user = { 
                id: user._id, 
                email: user.email, 
                role: user.role, 
                recruiterName: user.recruiterName, 
                contactNo: user.contactNo,
                currentCompany:user.currentCompany,
                currentDesignation:user.currentDesignation,
                PAN:user.PAN,
                TAN:user.TAN,
                GST:user.GST,
                plan:user.plan,
                limit:user.limit,
                aliasUsers:user.aliasUsers,
                pastLimits:user.pastLimits,
                currentLimit:user.currentLimit,
                block:user.block,
                planActive:user.planActive,
                
            };
            req.session.save(err => {
                if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session save failed" });
    }
    res.json({ message: "Login successful!", user: req.session.user });
});


        }else if(user.aliasRole === "alias"){

            req.session.user = {
                id: user._id,
                email:user.aliasEmail,
                role:user.aliasRole,
                recruiterName:user.aliasName,
                contactNo:user.aliasContactNo,
                limit:user.limit,
                block:user.block,
                suspend:user.suspend
            }
            req.session.save(err => {
                if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session save failed" });
    }
    res.json({ message: "Login successful!", user: req.session.user });
});


            user.loginHistory.unshift(Date.now())
            user.logoutHistory = user.logoutHistory.slice(0, 10);
            await user.save()

        }



       return res.json({ message: "Login successful!", user:req.session.user});

    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message });
    }
});

router.get("/api/account/me/", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Not logged in" });
        }

        return res.json({ success: true, user: req.session.user });
});

router.get("/api/account/checkplan", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Login again" });
        }

        let planActive = null;
        let recruiter = await recruiterModule.findById(req.session.user.id);

        if (!recruiter) {
            recruiter = await aliasUserModel.findById(req.session.user.id);
            if (recruiter) {
                const rootRecruiter = await recruiterModule.findById(recruiter.recruiterId);
                if (rootRecruiter) {
                    planActive = rootRecruiter.planActive;
                }
            }
        } else {
            planActive = recruiter.planActive;
        }

        if (!recruiter) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json({ success: true, user: planActive });

    } catch (error) {
        console.error("Error in /api/account/checkplan:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

});

router.get("/api/account/getview",  async (req, res) => {
    try {
        const { recruiterId } = req.query; 
        if (!recruiterId) {
        return res.status(400).json({ success: false, message: "Recruiter ID is required" });
        }

        let user = await recruiterModule.findById(recruiterId);

        if(!user){
            user = await aliasUserModel.findById(recruiterId);
        }

        if (!user) {
        return res.status(404).json({ success: false, message: "Recruiter not found" });
        }

        let viewCount = null

        if(user.aliasRole === 'alias'){
            viewCount = user.recruiterId.viewedProfile.length
        }else{
            viewCount = user.viewedProfile.length;
        }


        if(user.aliasRole === 'alias'){
            const rootRecruiter = await findById(user.recruiterId)
            rootRecruiter.totalView = viewCount

            await rootRecruiter.save()
        }else{
            user.totalView = viewCount;
        }

        await user.save();

        res.json({ 
            success: true, 
            view: {
            viewedProfiles: user.role === 'recruiter'? user.viewedProfile : user.recruiterId?.viewedProfile || [], 
            totalView: user.role === 'recruiter'? user.totalView : user.recruiterId?.totalView
            }
            
        });
    } catch (error) {
        console.error("Error fetching view data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get("/api/account/user/:userEmail", async (req, res) => {
    try {
        const { userEmail } = req.params;
        if (!userEmail) return res.status(400).json({ message: "Email is required." });

        const user = await recruiterModule.findOne({ email: userEmail })
        if (!user) return res.status(404).json({ message: "User not found." });
          

        res.json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error("🚨 Error Fetching User:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/api/recruiter/save-history',  async (req, res) => {
    try {
      const { recruiterId, header, filters } = req.body;     

      let recruiter = await recruiterModule.findById(recruiterId);

      if(!recruiter){
        recruiter = await aliasUserModel.findById(recruiterId)
      }
      
      if (!recruiter) {
      return res.status(404).json({ success: false, message: "Recruiter not found" });
      }

      recruiter.savedSearches.push({header, filters });

      if (recruiter.savedSearches.length > 10) {
        recruiter.savedSearches.shift();
      }
  
      await recruiter.save();
      
      res.json({ success: true, message: "Search history saved successfully" });
  
    } catch (error) {
      console.error("Error saving search history:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get('/api/recruiter/gethistory/:id',  async (req, res) => {
try {
    const {id} = req.params;
    let recruiter = await recruiterModule.findById(id).select('savedSearches');

    if(!recruiter){
        recruiter = await aliasUserModel.findById(id).select('savedSearches')
    }
    if (!recruiter) {
    return res.status(404).json({ success: false, message: "Recruiter not found" });
    }

    res.json({ success: true, searchHistory: recruiter.savedSearches });
} catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
}
});

router.post("/api/recruiter/history/delete/:id", async (req, res)=>{
try {
const {id} = req.params

if(!id) return res.status(400).json({message:"history id not found"})

if(!req.session.user || !req.session.user.id){
    return res.status(400).json({message: "Login again user"})
}
const recruiterid = req.session.user

let recruiter = null
if(recruiterid.role === 'recruiter'){
    recruiter = await recruiterModule.findByIdAndUpdate(recruiterid.id, 
    {$pull: {savedSearches:{_id:id}}},
    {new:true }
    )
    
}else{

    recruiter = await aliasUserModel.findByIdAndUpdate(recruiterid.id, 
    {$pull: {savedSearches:{_id:id}}},
    {new:true }
    )

}

if (!recruiter) {
return res.status(404).json({ message: "Recruiter not found" });
}

res.json({ success: true, message: "Search history deleted successfully", recruiter });
    
} catch (error) {
    res.status(500).json({message:"history not delete"})
    console.log(error.message)
}    

})

router.post("/api/recruiter/history/clear", async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: "Login again user" });
      }
  
      const recruiterId = req.session.user;

      let recruiter = null
      if(recruiterId.role === "recruiter"){
        recruiter = await recruiterModule.findByIdAndUpdate(
            recruiterId.id,
            { $set: { savedSearches: [] } }, 
            { new: true }
          );
          
        }else{
          recruiter = await aliasUserModel.findByIdAndUpdate(
              recruiterId.id,
              { $set: { savedSearches: [] } }, 
              { new: true }
            );

      }
  
      if (!recruiter) {
        return res.status(404).json({ message: "Recruiter not found" });
      }
    
      res.json({ success: true, message: "All search history cleared", recruiter });
  
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Failed to clear history", error: error.message });
    }
});

router.put("/api/recruiter/view-profile",  async (req, res) => {
    try {
        const { recruiterId, candidateId } = req.body;

        if (!recruiterId || !candidateId) {
        return res.status(400).json({ success: false, message: "Missing recruiterId or candidateId" });
        }

        let recruiter = await recruiterModule.findById(recruiterId);

        if(!recruiter){
            recruiter = await aliasUserModel.findById(recruiterId).populate('recruiterId');
        }

        if (!recruiter) {
        return res.status(404).json({ success: false, message: "Recruiter not found" });
        }

        if(recruiter.role === 'recruiter'){
            if (recruiter.viewedProfile.includes(candidateId)) {
            return res.json({ success: true, message: "Profile already viewed", recruiter });
            }
            
        }else{
            if (recruiter.recruiterId.viewedProfile.includes(candidateId)) {
            return res.json({ success: true, message: "Profile already viewed", recruiter });
            }

        }


        let updatedRecruiter = null

        if(recruiter.role === "recruiter"){
             updatedRecruiter = await recruiterModule.findByIdAndUpdate(
            recruiterId,
            { $addToSet: { viewedProfile: candidateId  } },
            { new: true }
            );

        } else{
             updatedRecruiter = await recruiterModule.findByIdAndUpdate(
            recruiter.recruiterId._id,
            { $addToSet: { viewedProfile: candidateId  } },
            { new: true }
            );

        }

        
        

        res.json({ success: true});

    } catch (error) {
        console.error("Error updating viewedProfile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/api/candidate/profile", async (req, res) => {
    const { candidateId } = req.query; 
    try {
    if (!candidateId) {
    return res.status(401).json({ message: "Candidate ID not found" });
    }

    let candidate = await userModel.findById(candidateId);

    if(!candidate){
        candidate = await Candidate.findById(candidateId)
    }

    if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({ candidate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.put("/api/account/profile/save", async (req, res) => {
    const { candidateId, recruiterID } = req.body;
    try {
        if (!candidateId || !recruiterID) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let recruiter = await recruiterModule.findById(recruiterID);

        if(!recruiter){
            recruiter = await aliasUserModel.findById(recruiterID);
        }

        if (!recruiter) {
        return res.status(404).json({ success: false, message: "Recruiter not found" });
        }

        let existIdSchema = await userModel.findById(candidateId)
        let updateQuery;
        if (existIdSchema) {
            updateQuery = { $addToSet: { savedProfile: candidateId } };
        } else {
            updateQuery = { $addToSet: { savedProfileAnother: candidateId } };
        }



        let updatedRecruiter;
        if(recruiter.role === 'recruiter'){
            if (recruiter.savedProfile?.includes(candidateId)) {
            updatedRecruiter = await recruiterModule.findByIdAndUpdate(
            recruiterID,
            { $pull: { savedProfile: candidateId } },
            { new: true }
            );
    
            return res.json({ success: true, message: "Candidate Unsaved", savedProfiles: updatedRecruiter.savedProfile });
            }
            
        }else{

            if (recruiter.savedProfile?.includes(candidateId)) {
            updatedRecruiter = await aliasUserModel.findByIdAndUpdate(
            recruiterID,
            { $pull: { savedProfile: candidateId } },
            { new: true }
            );
    
            return res.json({ success: true, message: "Candidate Unsaved", savedProfiles: updatedRecruiter.savedProfile });
            }

        }

        if(recruiter.role === 'recruiter'){
            updatedRecruiter = await recruiterModule.findByIdAndUpdate(
            recruiterID,
            updateQuery,            
            { new: true }
            );
            
        }else{
            updatedRecruiter = await aliasUserModel.findByIdAndUpdate(
            recruiterID,
            updateQuery,
            { new: true }
            );

        }

        return res.json({ success: true, message: "Candidate Saved", savedProfiles: updatedRecruiter.savedProfile });

    } catch (error) {
        console.error("Error in PUT /api/account/profile/save:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

});

router.get("/api/account/profile/saved/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let recruiter = await recruiterModule.findById(id)
        .populate(["viewedProfile", "savedProfileAnother"])
        .populate("savedProfile");

        if(!recruiter){
            recruiter = await aliasUserModel.findById(id).populate(["savedProfile", "savedProfileAnother"]).populate("recruiterId.viewedProfile");
        }

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "Recruiter not found" });
        }

        const savedProfile = [...recruiter.savedProfile, ...recruiter.savedProfileAnother]
        const seenProfile = recruiter.role === 'recruiter'? recruiter.viewedProfile : recruiter.recruiterId.viewedProfile

        return res.json({
            success: true,
            savedProfile, 
            seenProfile,   
            message: "Saved profile IDs retrieved successfully",
        });

    } catch (error) {
        console.error("Error in GET /api/account/profile/saved/:id:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/api/account/password/update', async (req, res) => {
    try {
        const { recruiterId, password, newPassword } = req.body;

        if (!recruiterId || !password || !newPassword) {
        return res.status(400).json({ message: "Recruiter ID and password are required" });
        }

        let Recruiter = await recruiterModule.findById(recruiterId)

        if(!Recruiter){
            Recruiter = await aliasUserModel.findById(recruiterId)
        }

        if(!Recruiter){
            return res.status(404).json({ message: "login again and change" });
        }

        let isMatch = null

        if(Recruiter.role === 'recruiter'){
             isMatch = await bcrypt.compare(password, Recruiter.password)
        }else{
            isMatch = await bcrypt.compare(password, Recruiter.aliasPassword)
        }
        if(!isMatch){
        return res.json({message:"Enter a valid Password"})
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        let recruiter = null
        if(Recruiter.role === "recruiter"){
             recruiter = await recruiterModule.findByIdAndUpdate(
                recruiterId, 
                { password: hashedPassword }, 
                { new: true } 
            );
            
        }
        else{
             recruiter = await aliasUserModel.findByIdAndUpdate(
            recruiterId, 
            { aliasPassword: hashedPassword }, 
            { new: true } 
        )}

       

        if (!recruiter) {
        return res.status(404).json({ message: "Recruiter not found" });
        }

        res.json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.post("/api/forgot/password", forgotPassword )
router.post("/api/verify/otp", verifyOTP)
router.post("/api/reset/password", resetPassword )

router.post("/api/block/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const isExist = await aliasUserModel.findById(id);
        if (!isExist) return res.status(404).json({ message: "User not available" });

        const updatedUser = await aliasUserModel.findByIdAndUpdate(
            id, 
            { block: !isExist.block }, 
            { new: true }
        );

        res.json({
            success: true,
            message: updatedUser.block ? "User blocked successfully" : "User unblocked successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/api/alias/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await recruiterModule.findById(id).populate("aliasUsers")

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User unblocked successfully", user:user.aliasUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/api/account/logout", async (req, res) => {
    try {
        if (req.session.user && req.session.user.role === "alias") {

            const user = await aliasUserModel.findById(req.session.user.id);
            if (user) {
                user.logoutHistory.unshift(Date.now());
                user.logoutHistory = user.logoutHistory.slice(0, 10);
                await user.save();
            }

        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Logout failed", error: err.message });
            }
            res.clearCookie("connect.sid");
            res.json({ success: true, message: "Logged out successfully" });
        });

    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});





export default router;
