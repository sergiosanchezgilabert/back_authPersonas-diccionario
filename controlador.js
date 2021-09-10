var express = require("express")
var app = express()
var db = require("./bbdd.js")

app.set('view engine', 'ejs')


// Root endpoint
function indexFun(req, res, next) {
    res.status(200).render('pages/index')
}

// Insert here other API endpoints

function listaPersonasFun(req, res, next) {
    // db.run('DROP TABLE persona')

    db.findAll().then(personas => res.status(200).render('pages/listaPersonas', {
        personas: personas
    }));

}

function editarFun(req, res, next) {
    let data = req.query
    db.findByPk(data._id).then(function (persona) {
        persona.update({
            user: data.user,
            name: data.name,
            surname: data.surname
        }).then((persona) => {
            res.status(200).render('pages/persona', {
                persona: persona
            })
        });
    });
}

function aniadirPersonaFun(req, res) {
    res.render('pages/aniadirPersona')
}

function aniadirFun(req, res, next) {

    console.log(req.query)
    let data = req.query
    console.log(data)

    db.create({ user: data.user, name: data.name, surname: data.surname }).then(function (note) {
        res.status(200).render('pages/persona', {
            persona: data
        })
    });
}

function eliminarPersonaFun(req, res, next) {
    res.status(200).render('pages/eliminarPersona')
}

function eliminarFun(req, res, next) {
    db.findByPk(req.query._id).then(function (persona) {
        persona.destroy();
    }).then((persona) => {
        res.status(200).render('pages/eliminar')
    });
}

// index page 
var index = app.get('/', indexFun)
var editar = app.get("/api/editar/", editarFun)
var eliminar = app.get("/api/eliminar/", eliminarFun)
var eliminarPersona = app.get("/eliminarPersona/", eliminarPersonaFun)
var aniadir = app.get("/api/aniadir/", aniadirFun)
var aniadirPersona = app.get("/aniadirPersona", aniadirPersonaFun)
var listaPersona = app.get("/listaPersonas", listaPersonasFun)

module.exports = { index, editar, eliminar, eliminarPersona, aniadir, aniadirPersona, listaPersona }