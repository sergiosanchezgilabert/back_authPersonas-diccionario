var express = require("express")
var app = express()
var db = require("./bbdd.js")

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = 'secretkey123456';
const jwt_decode = require('jwt-decode');


//Necesario para enviar datos en method POST
app.use(express.json());
app.use(express.urlencoded());

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
        if (usuario !== null) {
            const resultPassword = bcrypt.compareSync(password, usuario.password)
            if (resultPassword) {
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
        } else {
            res.status(401).send({ message: 'Imposible obtener' })

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

function googlePersonaFun(req, res) {
    res.render('pages/aniadirPersona')
}

function googleFun(req, res, next) {
    let data = req.body

    var token = data.idToken
    var decoded = jwt_decode(token)

    if (decoded) {
        db.findOne({
            where: { user: data.email },
            order: [['createdAt', 'DESC']],
        }).then(persona => {
            console.log(persona + 'Persona encontrada')
            if (persona !== null) {
                var userResp = {
                    name: persona.name,
                    user: persona.user,
                    accessToken: data.idToken,
                    expiresIn: data.response.expires_in
                }

                res.status(200).send(userResp)
            } else {
                var randomstring = Math.random().toString(36).slice(-8);
                db.create({ user: data.email, password: randomstring, name: data.name }).then(usuario => {

                    var userResp = {
                        name: usuario.name,
                        user: usuario.user,
                        accessToken: data.idToken,
                        expiresIn: data.response.expires_in
                    }

                    res.status(200).send(userResp)
                });
            }
        })
    }
    else {
        res.status(400).send({ message: 'Imposible Insertar - Token Erroneo' })
    }
}

function aniadirPersonaFun(req, res) {
    res.render('pages/aniadirPersona')
}

function aniadirFun(req, res, next) {

    let data = req.body

    if (data.user == null || data.password == null || data.name == null || data.surname == null) {
        res.status(400).send({ message: 'Imposible Insertar - Datos Erroneos' })
    }

    console.log(data)

    db.findOne({
        where: { user: data.user },
        order: [['createdAt', 'DESC']]
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
    })

    /*  
      if(data.repitePassword!==data.password){
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
var editar = app.put("/api/editar/", editarFun)
var eliminar = app.delete("/api/eliminar/", eliminarFun)
var eliminarPersona = app.get("/eliminarPersona/", eliminarPersonaFun)
var ver = app.get("/api/ver/", verFun)
var verPersona = app.get("/verPersona/", verPersonaFun)
var aniadir = app.post("/api/aniadir/", aniadirFun)
var aniadirPersona = app.get("/aniadirPersona", aniadirPersonaFun)
var google = app.post("/api/google/", googleFun)
var googlePersona = app.get("/googlePersona", googlePersonaFun)
var obtenerPersona = app.get("/persona", obtenerPersonaFun)
var listaPersona = app.get("/listaPersonas", listaPersonasFun)

module.exports = {
    index, editar, eliminar, eliminarPersona, aniadir,
    aniadirPersona, listaPersona, obtenerPersona, ver, verPersona, google, googlePersona
}