const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // 👈 Asegúrate de cargar las variables de entorno

const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI;

console.log('🌐 URI de conexión:', mongoURI); // 👈 Verifica que se esté leyendo bien

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');

    // Iniciar servidor solo después de conectar a la base de datos
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
  });