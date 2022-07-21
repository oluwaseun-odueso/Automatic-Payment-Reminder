const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.PROD_SQ_DATABASE, process.env.PROD_SQ_USER, process.env.PROD_SQ_PASSWORD, {
    host: process.env.PROD_HOST,
    dialect: 'mysql'
  });

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.log('Unable to connect to the database:', error))

module.exports = sequelize