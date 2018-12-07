var express = require('express');

var mdAuth = require('../middlewares/auth');

var app = express();


var Medico = require('../models/medico');


//Obtener todos los medicos
app.get('/', (req, res, next) => {
    var start = req.query.start || 0;
    start = Number(start);

    Medico.find({})
        .skip(start)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando listado de medicos',
                    errors: err
                });
            }
            Medico.count((err, total) => {
                res.status(200).json({
                    ok: true,
                    total: total,
                    medicos: medicos
                });
            });
        });
});



//Crear un nuevo medico
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuariotoken
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.usuariotoken
        });
    });
});

//Actualizar un medico
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe medico con ese id' }
            });
        }
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = req.usuariotoken

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });
});

//Eliminar un medico
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;