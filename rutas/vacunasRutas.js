const express = require('express');
const rutas = express.Router();
const VacunasModel = require('../models/Vacunas');
const AdopcionesModel = require('../models/Adopciones');

// 1. Endpoint: Traer todas las vacunas
rutas.get('/traerVacunas', async (req, res) => {
    try {
        const vacunas = await VacunasModel.find().populate('adopcion');
        res.json(vacunas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 2. Endpoint: Crear nueva vacuna
rutas.post('/crear', async (req, res) => {
    const vacuna = new VacunasModel({
        adopcion: req.body.adopcion,
        nombre_vacuna: req.body.nombre_vacuna,
        historial_vacunas: req.body.historial_vacunas,
        tipo_vacuna: req.body.tipo_vacuna,
        fecha: req.body.fecha
    });

    try {
        const nuevaVacuna = await vacuna.save();
        res.status(201).json(nuevaVacuna);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 3. Endpoint: Editar vacuna
rutas.put('/editar/:id', async (req, res) => {
    try {
        const vacunaEditada = await VacunasModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vacunaEditada) {
            return res.status(404).json({ mensaje: 'Vacuna no encontrada!' });
        } else {
            return res.status(201).json(vacunaEditada);
        }
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 4. Endpoint: Eliminar vacuna
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const vacunaEliminada = await VacunasModel.findByIdAndDelete(req.params.id);
        if (!vacunaEliminada) {
            return res.status(404).json({ mensaje: 'Vacuna no encontrada!' });
        } else {
            return res.json({ mensaje: 'Vacuna eliminada!' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = rutas;