import nodemailer from 'nodemailer';

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOTPEmail = async (email, otp) => {
    const authEmail = process.env.EMAIL_USER
    const authPass = process.env.EMAIL_PASS
    console.log(authEmail, authPass)
    console.log(email, otp)
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,        
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        },
    });

    transporter.verify((error, success) => {
        if (error) {
          console.log("SMTP Error:", error);
        } else {
          console.log("SMTP Server is ready to send emails");
        }
      });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for TalentX password reset is: ${otp}. It is valid for 5 minutes.`,
    };

    return transporter.sendMail(mailOptions);
};
