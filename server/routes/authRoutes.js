const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory OTP store (consider Redis for production)
const otpStore = {};

// 🔐 Google Login
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: name || 'User', email });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('❌ Google login error:', error);
    res.status(401).json({ message: 'Google login failed' });
  }
});

// 🔐 Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // ⚠️ Debug only (remove in prod)
    console.log(`OTP for ${email}: ${otp}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your VisuVerse OTP',
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ OTP send error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// 🔐 Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return res.status(400).json({ message: 'No OTP found or expired' });
    }

    if (storedOtp !== otp.toString()) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    delete otpStore[email]; // Clear used OTP

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('❌ OTP verify error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

module.exports = router;
