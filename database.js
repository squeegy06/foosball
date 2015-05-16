var mysql = require('mysql');
var config = require('./config');
var database = mysql.createConnection(config.database);
database.connect();

module.exports = database;