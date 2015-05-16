var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/' , function(req, res, next){
  var query = 'SELECT name FROM players';
  connection.query(query, function(err, results){
    if(err) return res.status(500).send('Error connecting to the database.');
    
    res.status(200).render('createMatch' , {players: results});
  });
});

module.exports = router;