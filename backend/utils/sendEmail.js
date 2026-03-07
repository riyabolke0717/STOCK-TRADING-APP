const nodemailer = require('nodemailer');

const sendResetEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                // Gmail app password, not your normal password
                pass: process.env.GMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${token}`;

        const mailOptions = {
            from: `"Nexxtrade Support" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - Nexxtrade',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 10px; padding: 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1a73e8; margin: 0;">Nexxtrade</h1>
                    </div>
                    <h2 style="color: #333 text-align: center;">Reset Your Password</h2>
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Hello,
                    </p>
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        We received a request to reset your password for your Nexxtrade account. Click the button below to choose a new password:
                    </p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${resetUrl}" style="background-color: #1a73e8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #555; font-size: 14px; line-height: 1.5;">
                        If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.
                    </p>
                    <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
                        <p>© 2026 Nexxtrade. All rights reserved.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email sending failed. Please check your GMAIL_USER and GMAIL_PASS with "App Password".');
    }
};

module.exports = { sendResetEmail };
