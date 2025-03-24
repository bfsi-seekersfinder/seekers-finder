import Recruiter from "../schema/createRecruiter.mongoose.js";


const verifyOTP = async (req, res) => {
    try {
        const { email, OTP } = req.body;

        if (!email || !OTP) return res.status(400).json({ message: "All fields are required" });
        const user = await Recruiter.findOne({ email });
        if (!user || user.OTP !== Number(OTP)) return res.status(400).json({ message: "Invalid OTP" });

        if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

        user.OTP = null; 
        user.otpExpiry = null;
        await user.save();

       return res.json({ message: "OTP verified successfully", success:true });
    } catch (error) {
       return res.status(500).json({ message: "Server error", error: error.message });
    }
    
};

export default verifyOTP;
