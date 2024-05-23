//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas')
const Usuario = require('./models/Usuario')
require('dotenv').config();
const app = express();
// Lista de tokens inválidos
let invalidTokens = [];
// ruta
const adopcionesRutas = require('./rutas/adopcionesRutas');
const vacunasRutas = require('./rutas/vacunasRutas');

// configuraciones de environment
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        console.log("token", token );
        if(!token)
            res.status(401).json({mensaje:'No existe el token de autenticacion'});
        // Verificar si el token está en la lista de tokens inválidos
        if (invalidTokens.includes(token)) {
            return res.status(401).json({ mensaje: 'Token inválido!' });
        }
        const decodificar = jwt.verify(token, 'clave_secreta');
        console.log("decodificar", decodificar );
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        console.log(req);
        //if (!req.usuario) {
            //return res.status(401).json({ mensaje: 'Usuario no encontrado' });
       // }
        next();
    } 
    catch(error){
        res.status(400).json({error: 'Token invalido!!'})
    }
};

// Ruta para cerrar sesión
app.post('/auth/cerrarsesion', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        invalidTokens.push(token);
    }
    res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
});
app.use('/auth', authRutas);
app.use('/adopciones', autenticar, adopcionesRutas );
app.use('/vacunas', autenticar, vacunasRutas);
//Utilizar las rutas de recetas
//app.use('/adopciones', adopcionesRutas );