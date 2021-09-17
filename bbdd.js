
var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = 'secretkey123456'

// Option 1: Passing parameters separately
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})
/*
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE persona (
            id_persona INTEGER PRIMARY KEY AUTOINCREMENT,
            user text,
            password,
            name text, 
            surname text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (user,password, name, surname) VALUES (?,?,?)'
                //db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert, ["user1","Sergio","Sanchez"])
                db.run(insert, ["user2","Jose","Rueda"])
            }
        });  
    }
});*/

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const Persona = sequelize.define('persona', {id_persona:{type: Sequelize.INTEGER,autoIncrement: true,primaryKey: true}, 
  user: Sequelize.TEXT,password:Sequelize.TEXT, name: Sequelize.STRING, surname: Sequelize.STRING });

  sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
  });

  sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);

    Persona.bulkCreate([
      { user: 'user1',password:bcrypt.hashSync('123456'), name: 'Sergio',surname:'Sanchez' },
      { user: 'user2',password:bcrypt.hashSync('654321'), name: 'Jose',surname:'Rueda' },
    ]).then(function() {
      return Persona.findAll();
    }).then(function(persona) {
      console.log(persona);
    });
  });

module.exports = Persona
