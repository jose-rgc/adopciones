const mongoose = require('mongoose');

// Definir el esquema
const vacunasSchema = new mongoose.Schema({
    adopcion: { type: mongoose.Schema.Types.ObjectId, ref: 'Adopciones', required: true },
    nombre_vacuna: { type: String, required: true },
    historial_vacunas: { type: String, required: true },
    tipo_vacuna: { type: String, required: true },
    fecha: { type: Date, required: true }
});

const VacunasModel = mongoose.model('Vacunas', vacunasSchema, 'vacunas');
module.exports = VacunasModel;