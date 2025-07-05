const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Acceso denegado.' });

  // Extraemos el token quitando el prefijo "Bearer " si está presente
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const verified = jwt.verify(token, 'tu_secreto_super_seguro'); // Usa tu mismo secreto JWT
    req.user = verified; // Aquí guardas el payload (id, email, etc.) para usarlo después si quieres
    next(); // Continúa con la ruta
  } catch (err) {
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = verifyToken;
