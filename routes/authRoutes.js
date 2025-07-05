// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('📥 Registro recibido:', req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El email ya está registrado.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente.' });

  } catch (error) {
    console.error('🔥 Error en /register:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('🔐 Login recibido:', req.body);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      { expiresIn: '1d' }
    );

    console.log('✅ Login exitoso para:', email);

    res.json({
      message: 'Login exitoso.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('🔥 Error en /login:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;