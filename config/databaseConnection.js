const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.PROD_SQ_DATABASE, process.env.PROD_SQ_USER, process.env.PROD_SQ_PASSWORD, {
    dialect: 'mysql', 
    dialectOptions: {
      host: process.env.PROD_SQ_HOST, 
      multipleStatements: true
    }
  });

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.log('Unable to connect to the database:', error))

module.exports = sequelize