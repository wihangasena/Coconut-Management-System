import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    if (await User.findOne({ $or: [{ username }, { email }] })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, fullName, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({ token, user: { id: user._id, username: user.username, role: user.role, fullName: user.fullName } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
