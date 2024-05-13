//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
// ruta
const adopcionesRutas = require('./rutas/adopcionesRutas');

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
//Utilizar las rutas de recetas
app.use('/adopciones', adopcionesRutas );