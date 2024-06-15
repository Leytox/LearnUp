const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function Register(req, res) {
  const { name, email, password, role, bio } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
    user = new User({ name, email, password, role, bio });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
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
      return res.status(400).json({ msg: "No user with such email found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });
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

module.exports = { Register, Login };
