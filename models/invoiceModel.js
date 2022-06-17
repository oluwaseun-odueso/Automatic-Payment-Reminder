const { Sequelize, DataTypes } = require('sequelize');
const connection = require('../config/databaseConnection')


const Invoice = connection.define('Invoice', {
    invoice_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_name: {
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
    description_of_work_done: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Amount_to_be_paid: {
        type: DataTypes.STRING, 
        allowNull: false
    }
  }, {
    // Other model options go here
  });
  
module.exports = Invoice