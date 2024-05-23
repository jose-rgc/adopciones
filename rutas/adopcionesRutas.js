const express = require('express');
const rutas = express.Router();
const AdopcionesModel = require ('../models/Adopciones');
const UsuarioModel = require('../models/Usuario');
const VacunasModel = require('../models/Vacunas');
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
        fecha_vacunas: req.body.fecha_vacunas,
        usuario: req.body.usuario //asignar el id del usuario
    })
    console.log(adopciones);
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
//5. endpoint: Obtener adopciones por género y rango de edad
rutas.get('/filtrarPorGeneroEdad/:genero/:min/:max', async (req, res) => {
    try {
        const { genero, min, max } = req.params;
        const adopciones = await AdopcionesModel.find({ genero, edad: { $gte: min, $lte: max } });
        res.json(adopciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
//6. endpoint: Obtener estadísticas de adopciones por género de mascota
rutas.get('/estadisticasPorGenero', async (req, res) => {
    try {
        const estadisticas = await AdopcionesModel.aggregate([
            { $group: { _id: '$genero', total: { $sum: 1 } } },
            { $project: { _id: 0, genero: '$_id', total: 1 } }
        ]);
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
//7. endpoint: Eliminar adopciones por rango de edad
rutas.delete('/eliminarPorRangoEdad/:min/:max', async (req, res) => {
    try {
        const { min, max } = req.params;
        const adopcionesEliminadas = await AdopcionesModel.deleteMany({ edad: { $gte: min, $lte: max } });

        if (adopcionesEliminadas.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'No se encontró ninguna adopción en este rango de edad.' });
        }

        return res.json({ mensaje: 'Se eliminaron los registros de adopción dentro del rango de edad especificado.' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
//8. endpoint: Obtener adopciones por la fecha de vacunacion
rutas.get('/FechaVacunacionEspecifica/:fecha', async (req, res) => {
    try {
        const { fecha } = req.params;
        const adopciones = await AdopcionesModel.find({ fecha_vacunas: fecha });
        res.json(adopciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//REPORTES 1
rutas.get('/adopcionPorUsuario/:usuarioId', async (peticion, respuesta) => {
    const {usuarioId} = peticion.params;
    console.log(usuarioId);
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if (!usuario)
            return respuesta.status(404).json({mensaje: 'usuario no encontrado'});
        const adopciones = await AdopcionesModel.find({usuario : usuarioId}).populate('usuario');
        respuesta.json(adopciones);
    }catch (error) {
        respuesta.status(500).json({ mensaje: error.message });
    }
});
//REPORTES 2
//Sumar edades de adopciones por usuarios
rutas.get('/edadPorUsuario', async (req, res) => {
    try{
        const usuarios = await UsuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async (usuario1) => {
                const adopciones = await AdopcionesModel.find({usuario: usuario1._id});
                const totalEdades = adopciones.reduce((sum, adopcion) => sum + adopcion.edad, 0);
                return {
                    usuario: { 
                        _id: usuario1._id,
                        nombreusuario: usuario1.nombreusuario
                    },
                    totalEdades,
                    adopciones: adopciones.map(a => ({
                        _id: a._id,
                        nombre_mascota: a.nombre_mascota,
                        edades: a.edad
                    })) 
                }
            })
        )
        res.json(reporte);
    }catch (error){
        res.status(500).json
    }
});
// Reporte: Vacunas por Adopción
rutas.get('/vacunasPorAdopcion', async (req, res) => {
    try {
        const adopciones = await AdopcionesModel.find();
        const reporte = await Promise.all(
            adopciones.map(async (adopcion) => {
                const vacunas = await VacunasModel.find({ adopcion: adopcion._id });
                return {
                    adopcion: {
                        _id: adopcion._id,
                        nombre_mascota: adopcion.nombre_mascota
                    },
                    vacunas: vacunas.map(vacuna => ({
                        _id: vacuna._id,
                        nombre_vacuna: vacuna.nombre_vacuna,
                        fecha: vacuna.fecha
                    }))
                };
            })
        );
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
// REPORTE: INDICAR LAS MASCOTAS CON LA MISMA VACUNA
rutas.get('/mascotasConVacuna/:nombreVacuna', async (req, res) => {
    try {
        const nombreVacuna = req.params.nombreVacuna;
        const vacunas = await VacunasModel.find({ nombre_vacuna: nombreVacuna });
        const idsMascotas = vacunas.map(vacuna => vacuna.adopcion);
        const mascotasConVacuna = await AdopcionesModel.find({ _id: { $in: idsMascotas } });
        const nombresMascotas = mascotasConVacuna.map(mascota => mascota.nombre_mascota);
        res.json({ mascotasConVacuna: nombresMascotas });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = rutas;
