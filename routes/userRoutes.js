// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/verifyToken');

// PUT /api/users/update
router.put('/update', verifyToken, async (req, res) => {
  const { email, password } = req.body;

  // Validar que al menos un campo se esté actualizando
  if (!email && !password) {
    return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está en uso por otro usuario.' });
      }
      user.email = email;
    }

    // Actualizar contraseña si se proporciona
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error al actualizar perfil' });
  }
});

module.exports = router;