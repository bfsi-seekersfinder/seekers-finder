import { sendOTPEmail } from "../generator/otpGen.js";
import recruiterModule from "../schema/createRecruiter.mongoose.js";
import bcrypt from "bcrypt"

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ message: "All fields are required" });

        const user = await recruiterModule.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        const mail = 'Your TalentX Password is Reset Succesfully'
       await sendOTPEmail(email, mail)

       return res.json({ message: "Password reset successful" });
    } catch (error) {
       return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default resetPassword;
