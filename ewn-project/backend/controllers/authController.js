const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ewn_super_secret_key_123';

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password, // hashed in pre-save middleware
      isPremium: false
    });
    
    const token = jwt.sign(
      { id: user._id, email: user.email, isPremium: user.isPremium }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { email: user.email, isPremium: user.isPremium } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isPremium: user.isPremium }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ token, user: { email: user.email, isPremium: user.isPremium } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.upgrade = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isPremium = true;
    await user.save();
    
    const newToken = jwt.sign(
      { id: user._id, email: user.email, isPremium: true }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ message: 'Upgraded to Premium!', token: newToken, user: { email: user.email, isPremium: true } });
  } catch (err) {
    console.error("Upgrade error:", err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
