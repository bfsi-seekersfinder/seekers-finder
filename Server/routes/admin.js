import express from 'express'
import adminModule from '../schema/admin.mongoose.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import upload from "../middleware/multer.js";
import User from "../schema/user.mongoose.js"


const router = express.Router()

// const isAdmin = (req, res, next) => {
//     if (req.session.admin) {
//         return next();
//     }
//     res.status(403).json({ message: "Forbidden: Admin session required" });
// };


router.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Enter email and password" });
        }

        const admin = await adminModule.findOne({ adminEmail: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not Found" });
        }

        const dcryptPass = await bcrypt.compare(password, admin.password);
        if (!dcryptPass) {
            return res.status(400).json({ message: "Wrong credentials" });
        }

        req.session.admin = {
            _id: admin._id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            adminContact: admin.adminContact,
        };


        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error" });
            }

            res.json({ success: true, message: "Login successful", admin: req.session.admin });
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/api/me', async (req, res) => {
    try {


        if (!req.session.admin) {
            return res.status(401).json({ message: "Login Again" });
        }

        res.json({ success: true, admin: req.session.admin });
    } catch (error) {
        console.error("Error in /me:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/api/admin/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const admin = await adminModule.findById(id).populate("notification.refrence")
        
        if (!admin) {
            return res.status(404).json({ message: "Unauthorized access denied" });
        }

        res.json({ success: true, admin });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/api/query', async (req, res) => {
    try {
        const {
            recruiterName,
            email,
            contactNo,
            companyName,
            designation,
            location,
            queryMessage 
        } = req.body;


        const Admin = await adminModule.find({ adminRole: "Super Admin" });

        if (!Admin) {
            return res.status(404).json({ message: "Super Admin not found" });
        }

        // Push notification to Admin
        for(const admin of Admin){
            admin.notification.push({
                notificationType:"queryReq",
                headLine: `New query received from ${recruiterName}`,
                queryMessage,
                sender: null,
                details:{
                    recruiterName,
                    contactNo,
                    email,
                    companyName,
                    designation,
                    location
                },
                createdAt: new Date()
            });

            await admin.save();
        }


        return res.json({ success: true, message: "Query sent." });

    } catch (error) {
        console.log("Error in /api/query:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/recruiter/getsuggestion", async (req, res) => {
    try {
        const { recruiterId, recruiterName, candidateId, suggestion } = req.body;

        if (!recruiterId || !suggestion) { 
            return res.status(401).json({ message: "Something missing or unauthorized" });
        }

        const Admins = await adminModule.find({ adminRole: "Super Admin" });

        for (const admin of Admins) {
            admin.notification.push({
                notificationType: "recruiter suggestion",
                sender: recruiterId,
                refrence:candidateId,
                headLine: `New suggestion from ${recruiterName}`,
                message:suggestion
                
            });
        
            await admin.save(); 
        }

        res.json({ success: true, message: "Thank You ❤️ for Your Suggestion" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
    if (err) {
    return res.status(500).json({ message: "Logout failed", error: err.message });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
    });
});


router.post("/api/create-candidate", upload.single("cv"), async (req, res) => {
    try {
        const {
            fullName,
            mobileNo,
            email,
            gender,
            workExperience = "[]",
            product,
            yearsOfExperience,
            noticePeriod,
            currentCtc,
            previousCompanies = "[]",
            education = "[]",
            userLocation = "[]",
            maritalStatus,
            keySkills = "[]",
        } = req.body;

        // Parse JSON fields properly
        const parsedWorkExperience = JSON.parse(workExperience);
        const parsedPreviousCompanies = JSON.parse(previousCompanies);
        const parsedEducation = JSON.parse(education);
        const parsedUserLocation = JSON.parse(userLocation);
        const parsedKeySkills = JSON.parse(keySkills);

        // Handle file upload
        let cvUrl = [];
        if (req.file) {
            cvUrl.push(`uploads/${req.file.filename}`);
        }

        // Create new candidate
        const newCandidate = new User({
            fullName,
            mobileNo: Number(mobileNo) || null,
            email,
            gender,
            workExperience: parsedWorkExperience,
            product,
            yearsOfExperience: Number(yearsOfExperience) || null,
            noticePeriod,
            currentCtc,
            previousCompanies: parsedPreviousCompanies,
            education: parsedEducation,
            userLocation: parsedUserLocation,
            maritalStatus,
            keySkills: parsedKeySkills,
            cv: cvUrl,
        });

        // Save to database
        await newCandidate.save();
        res.status(201).json({ success: true, message: "Candidate created successfully!", newCandidate });
    } catch (error) {
        console.error("Error creating candidate:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


export default router