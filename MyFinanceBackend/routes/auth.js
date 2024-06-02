const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Error registering user' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, config.secret, {
      expiresIn: '7d',
    });
    res.send({ token });
  } catch (error) {
    res.status(400).send({ error: 'Error logging in' });
  }
});

module.exports = router;
