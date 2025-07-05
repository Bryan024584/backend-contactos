const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // 👈 Mueve esto arriba

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // 👈 Asegúrate de que esté antes del listen

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mi_agenda', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});