import Recruiter from "../schema/createRecruiter.mongoose.js";

import { sendOTPEmail } from "../generator/otpGen.js";
import { generateOTP } from "../generator/otpGen.js";

 const  forgotPassword = async (req, res) => {
    try {
        const { email} = req.body;
        console.log(email)
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await Recruiter.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });


        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;
        console.log(otp, otpExpiry)

        user.OTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOTPEmail(email, otp);

        res.json({ message: "OTP sent to email", success:true });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default forgotPassword;
