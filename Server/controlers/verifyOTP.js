import Recruiter from "../schema/createRecruiter.mongoose.js";


const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "All fields are required" });

        const user = await Recruiter.findOne({ email });
        if (!user || user.OTP !== otp) return res.status(400).json({ message: "Invalid OTP" });

        if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

        user.OTP = null; 
        user.otpExpiry = null;
        await user.save();

        res.json({ message: "OTP verified successfully", success:true });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default verifyOTP;