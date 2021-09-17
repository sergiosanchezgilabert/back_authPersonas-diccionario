var express = require("express")
var app = express()
var db = require("./bbdd.js")

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = 'secretkey123456'

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

    var username = req.query.user
    var password = req.query.password

    db.findOne({
        where: { user: username },
        order: [['createdAt', 'DESC']],
    }).then(usuario => {
        if(usuario!==null){
            const resultPassword=bcrypt.compareSync(password,usuario.password)
            if(resultPassword){
                const expiresIn = 24 * 60 * 60
                const accessToken = jwt.sign({ id: usuario.id_persona },
                    SECRET_KEY, { expiresIn: expiresIn })

                var userResp = {
                    name: usuario.name,
                    user: usuario.user,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
            }
            res.status(200).send(userResp)
        }else{
            res.status(404).send({message:'Imposible obtener'})

        }
    });

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

    let data = req.query

    if (data.user == null || data.password == null || data.name == null || data.surname == null) {
        res.status(400).send({ message: 'Imposible Insertar - Datos Erroneos' })
    }

    db.findOne({
        where: { user: data.user },
        order: [['createdAt', 'DESC']],
    }).then(persona => {
        if (persona !== null) {
            res.status(403).send({ message: 'Nombre de usuario no disponible' })
        } else {
            db.create({ user: data.user, password: bcrypt.hashSync(data.password), name: data.name, surname: data.surname }).then(usuario => {
                /*res.status(200).render('pages/persona', {
                    persona: data
                })*/
                const expiresIn = 24 * 60 * 60
                const accessToken = jwt.sign({ id: usuario.id_persona },
                    SECRET_KEY, { expiresIn: expiresIn })

                var userResp = {
                    name: usuario.name,
                    user: usuario.user,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }

                res.status(200).send(userResp)
            });
        }
    });

    /*if(data.repitePassword!==data.password){
        res.status(400).send()
    }*/


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

function verPersonaFun(req, res, next) {
    res.status(200).render('pages/verPersona')
}

function verFun(req, res, next) {
    db.findByPk(req.query._id).then((persona) => {
        res.status(200).send(persona)
    });
}

// index page 
var index = app.get('/', indexFun)
var editar = app.get("/api/editar/", editarFun)
var eliminar = app.get("/api/eliminar/", eliminarFun)
var eliminarPersona = app.get("/eliminarPersona/", eliminarPersonaFun)
var ver = app.get("/api/ver/", verFun)
var verPersona = app.get("/verPersona/", verPersonaFun)
var aniadir = app.get("/api/aniadir/", aniadirFun)
var aniadirPersona = app.get("/aniadirPersona", aniadirPersonaFun)
var obtenerPersona = app.get("/persona", obtenerPersonaFun)
var listaPersona = app.get("/listaPersonas", listaPersonasFun)

module.exports = { index, editar, eliminar, eliminarPersona, aniadir, aniadirPersona, listaPersona, obtenerPersona, ver, verPersona }