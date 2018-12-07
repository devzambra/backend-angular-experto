var express = require('express');

var mdAuth = require('../middlewares/auth');

var app = express();


var Hospital = require('../models/hospital');


//Obtener todos los hospitales
app.get('/', (req, res, next) => {
    var start = req.query.start || 0;
    start = Number(start);

    Hospital.find({})
        .skip(start)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando listado de hospitales',
                    errors: err
                });
            }
            Hospital.count((err, total) => {
                res.status(200).json({
                    ok: true,
                    total: total,
                    hospitales: hospitales
                });
            });

        });
});



//Crear un nuevo usuario
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuariotoken._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuariotoken: req.usuariotoken
        });
    });
});

//Actualizar un hospital
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe hospital con ese id' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuariotoken._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });

    });
});

//Eliminar un hospital
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;