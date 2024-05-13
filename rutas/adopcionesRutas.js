const express = require('express');
const rutas = express.Router();
const AdopcionesModel = require ('../models/Adopciones');
// 1. endpoint: Traer todas las adopciones
rutas.get('/traerAdopciones', async (req, res) => {
    try {
        const adopciones = await AdopcionesModel.find();
        res.json(adopciones);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
} );
//2. endpoint: Crear Nueva Adopcion
rutas.post('/crear', async (req, res) => {
    const adopciones = new AdopcionesModel({
        nombre_adoptante: req.body.nombre_adoptante,
        nombre_mascota: req.body.nombre_mascota,
        genero: req.body.genero,
        edad: req.body.edad,
        contacto: req.body.contacto,
        fecha_vacunas: req.body.fecha_vacunas
    })
    try {
        const nuevaAdopcion = await adopciones.save();
        res.status(201).json(nuevaAdopcion);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//3. endpoint: Editar el registro de la adopcion
rutas.put('/editar/:id', async (req, res) => {
    try {
        const adopcionesEditada = await AdopcionesModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!adopcionesEditada)
            return res.status(404).json({ mensaje : 'Esta adopcion no esta registrado!!'});
        else
            return res.status(201).json(adopcionesEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//4. endpoint: Eliminar el registro de adopcion
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const adopcionEliminada = await AdopcionesModel.findByIdAndDelete(req.params.id);
       if (!adopcionEliminada)
            return res.status(404).json({ mensaje : 'Este registro de adopcion no se encuentra!!!'});
       else 
            return res.json({mensaje :  'Este registro de adopcion fue eliminado'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
module.exports = rutas;
