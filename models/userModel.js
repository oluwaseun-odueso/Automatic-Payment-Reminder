const { Sequelize, DataTypes } = require('sequelize');
const connection = require('../config/databaseConnection')


const User = connection.define('User', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    is_admin: {
        type: DataTypes.STRING,
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