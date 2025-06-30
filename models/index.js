const { Sequelize } = require('sequelize');
const todoModel = require('./todo');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  {
    host: config.host,
    dialect: config.dialect
  }
);

const Todo = todoModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Todo
};

module.exports = db; 