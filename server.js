const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create Transporter
// NOTE: For Gmail, you might need "App Password" if 2FA is on.
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Attractive OTP Template
const getOtpTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                color: white;
                margin: 0;
                font-size: 28px;
                font-weight: 800;
                letter-spacing: -0.5px;
            }
            .content {
                padding: 40px 30px;
                color: #3f3f46;
                text-align: center;
            }
            .welcome-text {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
                color: #52525b;
            }
            .otp-box {
                background: #f4f4f5;
                border: 2px dashed #cbd5e1;
                border-radius: 12px;
                padding: 20px;
                margin: 0 auto 30px;
                max-width: 200px;
            }
            .otp-code {
                font-family: 'Courier New', monospace;
                font-size: 32px;
                font-weight: bold;
                color: #4f46e5;
                letter-spacing: 4px;
                margin: 0;
            }
            .expiry-text {
                font-size: 12px;
                color: #a1a1aa;
                margin-top: 10px;
            }
            .footer {
                background: #fafafa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #a1a1aa;
                border-top: 1px solid #f4f4f5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Account</h1>
            </div>
            <div class="content">
                <p class="welcome-text">
                    Welcome to <strong>Attendly</strong>! We're excited to have you on board.
                    <br>
                    Please use the code below to verify your email address.
                </p>
                
                <div class="otp-box">
                    <p class="otp-code">${otp}</p>
                </div>

                <p class="expiry-text">
                    This code will expire in 15 minutes.
                    <br>
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Attendly Inc. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

app.post('/api/send-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const mailOptions = {
            from: `"Attendly Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Attendly Verification Code',
            html: getOtpTemplate(otp)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Email server running on port ${PORT}`);
});
