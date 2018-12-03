// Require
var express = require('express');
var mongoose = require('mongoose');


//Inicializar variables
var app = express();

//Conexion a la BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos en el puerto 27017: \x1b[32m%s\x1b[0m', '[ONLINE]');
});

//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});


//Escuchar peticiones
app.listen(8080, () => {
    console.log('Express server en el puerto 8080: \x1b[32m%s\x1b[0m', '[ONLINE]');
});