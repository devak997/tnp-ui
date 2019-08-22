const express = require("express");
const app = express();
let mysql = require("mysql");
const port=8000;

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sriharsha12345",
    database: "pragati_tnp"
  });
  
  con.connect(function(err) {
    if (err) {
      console.log(err);
    }
  });
  