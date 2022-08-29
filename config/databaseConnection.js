const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.SQ_DATABASE, process.env.SQ_USER, process.env.SQ_PASSWORD, {
    host: process.env.SQ_HOST,
    dialect: 'mysql'
  });

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.log('Unable to connect to the database:', error))

module.exports = sequelize