const mongoose  = require('mongoose');
//definir el esquema
const adopcionesSchema = new mongoose.Schema({
    nombre_adoptante: String,
    nombre_mascota: String,
    genero: String,
    edad: Number,
    contacto: Number,
    fecha_vacunas: String,
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
});
const AdopcionesModel = mongoose.model('Adopciones', adopcionesSchema, 'adopciones');
module.exports = AdopcionesModel;
