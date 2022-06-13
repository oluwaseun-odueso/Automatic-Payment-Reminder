const { Sequelize, DataTypes } = require('sequelize');
const connection = require('../config/databaseConnection')


const User = connection.define('User', {
    // Model attributes are defined here
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.NUMBER, 
        allowNull: false
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    }
  }, {
    // Other model options go here
  });
  
module.exports = User