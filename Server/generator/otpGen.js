import nodemailer from 'nodemailer';

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOTPEmail = async (email, otp) => {
    const authEmail = process.env.EMAIL_USER
    const authPass = process.env.APP_PASSWORD
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,        
        auth: {
            user: authEmail,
            pass: authPass, 
        },
    });

    transporter.verify((error, success) => {
        if (error) {
          console.log("SMTP Error:", error);
        } 
      });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: otp,
    };

    return transporter.sendMail(mailOptions);
};
