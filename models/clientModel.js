const { DataTypes } = require('sequelize');
const connection = require('../config/databaseConnection')

const Client = connection.define('Client', {
    name: {
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
}, {
    // Other model options go here
})
module.exports = Client