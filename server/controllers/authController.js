const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists with timeout handling
    let userExists;
    try {
      userExists = await User.findOne({ email }).maxTimeMS(5000);
    } catch (dbError) {
      // MongoDB not available - use demo mode
      console.log('⚠️  Database not available, creating demo account');
      
      const demoUser = {
        _id: 'demo-user-' + Date.now(),
        name: name,
        email: email,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`
      };
      
      const token = generateToken(demoUser._id);
      
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          avatar: demoUser.avatar
        },
        demo: true,
        message: 'Demo account created (MongoDB not connected)'
      });
    }

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user with timeout handling
    let user;
    try {
      user = await User.findOne({ email }).select('+password').maxTimeMS(5000);
    } catch (dbError) {
      // MongoDB not available - use demo mode
      console.log('⚠️  Database not available, using demo login');
      
      // Demo user for testing without MongoDB
      const demoUser = {
        _id: 'demo-user-id',
        name: 'Demo User',
        email: email,
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
      };
      
      const token = generateToken('demo-user-id');
      
      return res.json({
        success: true,
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          avatar: demoUser.avatar
        },
        demo: true,
        message: 'Logged in with demo account (MongoDB not connected)'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please register first or use any email/password for demo mode.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id).maxTimeMS(5000);
    } catch (dbError) {
      // MongoDB not available - return demo user
      return res.json({
        success: true,
        user: {
          id: req.user.id,
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'user',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
          portfolio: [],
          watchlist: []
        },
        demo: true
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
