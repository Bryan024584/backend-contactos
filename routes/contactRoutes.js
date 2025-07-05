const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Contact = require('../models/Contact');

// ✅ GET todos los contactos (protegido)
router.get('/contacts', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

// ✅ POST nuevo contacto (protegido)
router.post('/contacts', verifyToken, async (req, res) => {
  try {
    const { name, telefono, email } = req.body;
    const newContact = new Contact({ name, telefono, email });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ error: 'Error al guardar contacto', details: error.message });
  }
});

// ✅ DELETE contacto por ID (protegido)
router.delete('/contacts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contacto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
});

// ✅ PUT actualizar contacto por ID (protegido)
router.put('/contacts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, telefono, email } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, telefono, email },
      { new: true, runValidators: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar contacto', details: error.message });
  }
});

module.exports = router;
