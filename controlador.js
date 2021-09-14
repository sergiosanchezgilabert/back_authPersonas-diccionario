var express = require("express")
var app = express()
var db = require("./bbdd.js")

//el db esta mal


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

function obtenerPersonaFun(req, res, next) {
     //sequelize.query('DROP TABLE persona')

    var username=req.query.user
    var password=req.query.password

    db.findOne({
        where: { user:username,password:password },
        order: [ [ 'createdAt', 'DESC' ]],
    }).then(persona => res.status(200).send(persona));

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

    if(data.user==null || data.password==null  || data.name==null || data.surname==null){
        res.status(400).send({message: 'Imposible Insertar - Datos Erroneos'})
    }

    /*if(data.repitePassword!==data.password){
        res.status(400).send()
    }*/

    db.create({ user: data.user,password:data.password, name: data.name, surname: data.surname }).then(function (note) {
        /*res.status(200).render('pages/persona', {
            persona: data
        })*/
        res.status(200).send(data)
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
var obtenerPersona = app.get("/persona", obtenerPersonaFun)
var listaPersona = app.get("/listaPersonas", listaPersonasFun)

module.exports = { index, editar, eliminar, eliminarPersona, aniadir, aniadirPersona, listaPersona,obtenerPersona }