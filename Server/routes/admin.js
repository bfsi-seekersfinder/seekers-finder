import express from 'express'
import adminModule from '../schema/admin.mongoose.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import upload from "../middleware/multer.js";
import User from "../schema/user.mongoose.js"
import Candidate from '../schema/userdata.mongoose.js';


const router = express.Router()

const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.status(403).json({ message: "Forbidden: Admin session required" });
};

router.get("/api/session", async (req, res) =>{
    if(!req.session.admin){
        return res.json({messge:"session not available"})
    }
    return res.json({admin: req.session.admin})
});


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

        const totalUserDocs = await User.countDocuments()
        const totalCandidateDocs = await Candidate.countDocuments()
        const combineLength = totalUserDocs + totalCandidateDocs

        req.session.admin = {
            _id: admin._id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            adminContact: admin.adminContact,
            totalUser: combineLength
        };


        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error" });
            }

           return res.json({ success: true, message: "Login successful", admin: req.session.admin });
        });

    } catch (error) {
        console.log(error.message);
       return res.status(500).json({ message: "Server error" });
    }
});

router.get('/api/me',  async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.status(401).json({ message: "Login Again" });
        }
      return  res.json({ success: true, admin: req.session.admin });
    } catch (error) {
        console.error("Error in /me:", error.message);
       return res.status(500).json({ message: "Server error" });
    }

});

router.get("/api/admin/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if(!req.session.admin){
            return res.status(401).json({message:"Unathourized User"})
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const admin = await adminModule.findById(req.session.admin._id).populate(["notification.refrence","notification.refrenceAnother", "notification.sender"]);
        
        if (!admin) {
            return res.status(404).json({ message: "Unauthorized access denied" });
        }

       return res.json({ success: true, admin });

    } catch (error) {
        console.error(error.message);
       return res.status(500).json({ message: "Server error" });
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
            admin.notification.unshift({
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

        let ulterSchema = await User.findById(candidateId)
        // let updateSchema = ulterSchema? { refrence: candidateId }: { refrenceAnother: candidateId };

        if(ulterSchema){
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
            }else{

                for (const admin of Admins) {
                    admin.notification.push({
                        notificationType: "recruiter suggestion",
                        sender: recruiterId,
                        refrenceAnother:candidateId,
                        headLine: `New suggestion from ${recruiterName}`,
                        message:suggestion
                        
                    });

                    await admin.save(); 
                 }
        
            }

       return res.json({ success: true, message: "Thank You ❤️ for Your Suggestion" });

    } catch (error) {
        console.error(error.message);
       return res.status(500).json({ success: false, message: "Server error" });
    }
});

router.delete("/api/delete/notification/:adminId/:notificationId",  async (req, res) => {
    try {
        const { notificationId , adminId} = req.params;

        if (!notificationId || !adminId) {
            return res.status(400).json({ success: false, message: "Notification ID is required" });
        }

        const deletedNotification = await adminModule.findByIdAndUpdate(adminId, 
            {$pull: {notification : {_id: notificationId}}},
            {new: true}
        );

        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

       return res.json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
       return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.put('/api/update/seen/:adminId/:notificationId',  async (req, res) => {
    try {
        const { adminId, notificationId } = req.params;

        if (!adminId || !notificationId) {
            return res.status(400).json({ success: false, message: "Admin ID and Notification ID are required" });
        }

        const updatedAdmin = await adminModule.findOneAndUpdate(
            { _id: adminId, "notification._id": notificationId }, // Find admin with matching notificationId
            { $set: { "notification.$.seen": true } }, // Update the seen field to true
            { new: true }
        );
        
        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

      return res.json({ success: true, message: "Notification marked as seen", admin: updatedAdmin });
    } catch (error) {
        console.error("Error updating notification:", error);
       return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/api/users", async (req, res) => {
    try {
    const {limit, skip} = req.query

    const parsedLimit = parseInt(limit);
    const parsedSkip = parseInt(skip)

    if (isNaN(parsedLimit) || isNaN(parsedSkip)) {
        return res.status(400).json({ success: false, message: "Invalid limit or skip value" });
    }


    const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(parsedLimit)
    .skip(parsedSkip);

    const totalCandidates1 = await User.countDocuments()
    const totalCandidates2 = await Candidate.countDocuments()
    const totalCandidates = totalCandidates1 + totalCandidates2
   return res.json({ success: true, users , totalCandidates});

    } catch (error) {
    console.error("Error fetching users:", error);
   return res.status(500).json({ success: false, message: "Server error" });
    }

});


router.post("/api/logout", (req, res) => {

    if (!req.session.admin) {
        return res.status(400).json({ message: "No active session to log out" });
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed", error: err.message });
        }
        res.clearCookie("connect.sid");
       return res.json({ success: true, message: "Logged out successfully" });
    });
});



export default router
