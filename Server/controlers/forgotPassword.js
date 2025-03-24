import Recruiter from "../schema/createRecruiter.mongoose.js";
import { sendOTPEmail } from "../generator/otpGen.js";
import { generateOTP } from "../generator/otpGen.js";

 const  forgotPassword = async (req, res) => {
    try {
        const { email} = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await Recruiter.findOne({ email });
        if (!user) return res.status(404).json({ message: "Enter a Valid Email" });


        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        user.OTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        const otpMessage = `Your Talentx Password Reset OTP is ${otp}. This OTP is valid for 5 min, Don't share with anyone`
        await sendOTPEmail(email, otpMessage);

        return res.json({ message: "OTP sent to email", success:true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default forgotPassword;
