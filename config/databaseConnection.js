const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('databaseName', 'User', 'databasePassword', {
    host: 'localhost',
    dialect: 'mysql'
  });

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.log('Unable to connect to the database:', error))

module.exports = sequelize