require('dotenv').config({ path: './enviroments.env' })

// Create express app
var express = require("express")
var app = express()

app.use(express.json())

var cors = require('cors');
app.use(cors());

// Server port
var HTTP_PORT = process.env['PORT']

const controlador = require('./controlador')

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get('/', function (req, res) {
    controlador.index(req, res)
});
app.put("/api/editar/", function (req, res) {
    controlador.editar(req, res)
});
app.delete("/api/eliminar/", function (req, res) {
    controlador.eliminar(req, res)
});
app.get("/eliminarPersona/", function (req, res) {
    controlador.eliminarPersona(req, res)
});
app.get("/api/ver/", function (req, res) {
    controlador.ver(req, res)
});
app.get("/verPersona/", function (req, res) {
    controlador.verPersona(req, res)
});
app.post("/api/aniadir/", function (req, res) {
    console.log('Hola')
    controlador.aniadir(req, res)
});
app.get("/aniadirPersona", function (req, res) {
    controlador.aniadirPersona(req, res)
});
app.post("/api/google/", function (req, res) {
    controlador.google(req, res)
});
app.get("/googlePersona", function (req, res) {
    controlador.googlePersona(req, res)
});
app.get("/persona", function (req, res) {
    cors({origin: 'http://localhost:8000'})

    controlador.obtenerPersona(req, res)
});
app.get("/listaPersonas", function (req, res) {
    controlador.listaPersona(req, res)
});



// Default response for any other request
app.use(function (req, res) {

    
    res.status(404)
  
})