const inquirer = require("inquirer");
var mysql = require("mysql2");
var cTable = require("console.table");

require('dotenv').config()

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "spacejam",
    database: 'employee_db'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Welcome to the employee tracker!");
    console.log("--------------------------------")
    // init();
  });
