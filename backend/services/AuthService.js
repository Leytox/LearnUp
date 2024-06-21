const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/email");
const crypto = require("crypto");

function generateVerification() {
  return Math.floor(1000 + Math.random() * 9000);
}

function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

async function Register(req, res) {
  let { name, email, password, role, bio, phoneNumber } = req.body;
  try {
    phoneNumber = `+${phoneNumber}`;
    let user = await User.findOne({ email, phoneNumber });
    if (user) return res.status(400).json({ msg: "User already exists" });
    user = new User({ name, email, password, role, bio, phoneNumber });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.verificationCode = generateVerification();
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function VerifyViaEmail(req, res) {
  const { id } = req.body;
  try {
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.verificationCode = generateVerification();
    await user.save();
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: user.email,
      subject: "Verification Code",
      html: `<p>Your verification code is ${user.verificationCode}</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Verification code sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

async function VerifyAccount(req, res) {
  const { verificationCode, id } = req.body;
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({ msg: "No user with such id found" });
    if (user.verificationCode !== Number(verificationCode))
      return res.status(400).json({ msg: "Invalid verification code" });
    user.isPhoneVerified = true;
    await user.save();
    res.json({ msg: "Account verified successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function ForgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p><a href="${resetURL}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function ResetPassword(req, res) {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: user.email,
      subject: "Your password has been changed",
      html: `<p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function Login(req, res) {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No user with such email found", errorType: "email" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Invalid password", errorType: "password" });
    if (!user.isPhoneVerified)
      return res.status(400).json({
        msg: "Phone number not verified",
        errorType: "verification",
        userId: user.id,
      });
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.name, id: user.id, role: user.role });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  Register,
  VerifyViaEmail,
  VerifyAccount,
  ForgotPassword,
  ResetPassword,
  Login,
};
