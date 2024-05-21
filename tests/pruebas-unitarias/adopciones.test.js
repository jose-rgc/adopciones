const express = require('express');
const request = require('supertest');
const adopciones = require('../../rutas/adopcionesRutas')
const AdopcionesModel = require('../../models/Adopciones');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use('/adopciones', adopciones);

describe('Pruebas Unitarias para Adopciones', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appadopciones', {
            useNewUrlParser : true,
        });
        await AdopcionesModel.deleteMany({});
    });
    // al finalizar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
    });

    //1er test
    test('Deberia traer todas las recetas metodo: GET: traerAdopcion', async() =>{
        await AdopcionesModel.create({ nombre_adoptante: 'Sebastian', nombre_mascota: 'Leon', genero: 'macho', edad: 9, contacto: 72388884, fecha_vacunas: 'octubre'});
        await AdopcionesModel.create({ nombre_adoptante: 'Maribel', nombre_mascota  : 'Canela', genero: 'hembra', edad: 2, contacto: 71235687, fecha_vacunas: 'diciembre'});
        //colicitud - request
        const res = await request(app).get('/adopciones/traerAdopciones');
        //verificar las respuestas
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test('Deberia agregar una nueva Receta: POST: /crear', async() => {
        const nuevaAdopcion = {
            nombre_adoptante: 'Ricardo', 
            nombre_mascota: 'Luna',
            genero: 'hembra',
            edad: 1,
            contacto: 70468741,
            fecha_vacunas: 'enero, febrero'
        };
        const res =  await request(app)
                            .post('/adopciones/crear')
                            .send(nuevaAdopcion);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre_adoptante).toEqual(nuevaAdopcion.nombre_adoptante);
    });
    test('Deberia actualizar una tarea que ya existe: PUT /editar/:id', async()=>{
        const adopcionCreada = await AdopcionesModel.create(
                                    { nombre_adoptante: 'Sebastian', 
                                    nombre_mascota: 'Leon', 
                                    genero: 'macho', 
                                    edad: 9, 
                                    contacto: 72388884, 
                                    fecha_vacunas: 'octubre'});
        const adopcionActualizar = {
            nombre_adoptante: 'Sebastian (editado)',
            nombre_mascota: 'Leon (editado)',
            edad: 5,
            contacto: 72413645,
            fecha_vacunas: 'octubre (editado)'
        };
        const res =  await request(app)
                            .put('/adopciones/editar/'+adopcionCreada._id)
                            .send(adopcionActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre_adoptante).toEqual(adopcionActualizar.nombre_adoptante);                   
    });
    test('Deberia eliminar una tarea existente : DELETE /eliminar/:id', async() =>{
        const adopcionCreada = await AdopcionesModel.create(
            { nombre_adoptante: 'Sebastian', 
            nombre_mascota: 'Leon', 
            genero: 'macho', 
            edad: 9, 
            contacto: 72388884, 
            fecha_vacunas: 'octubre'}); 

        const res =  await request(app)
                                .delete('/adopciones/eliminar/'+adopcionCreada._id);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje :  'Este registro de adopcion fue eliminado'});
    });
});