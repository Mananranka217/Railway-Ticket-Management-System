const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


//An endpoint for registering a new user.
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("Register request received for:", email);
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(name, email, hashedPassword);
    const savedUser = await newUser.save();

    console.log('User registered successfully, ID:', savedUser.insertId);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};


// An endpoint to authenticate a user and return a token.
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received for email:', email);
  
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    //console.log('User found:', user);
  
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    console.log('Login successful, token generated:', token);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Error logging in' });
  }
};
