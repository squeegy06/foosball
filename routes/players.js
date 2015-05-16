var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/add', function(req, res, next){
  //Send that add player form.
  res.status(200).render('addPlayer');
});


router.post('/add' , function(req, res, next){
  var playerName = req.body.name;
  if(playerName === undefined || playerName.length === 0)
  {
    return res.status(400).send('No name provided');
  }
  
  var query = 'SELECT name FROM players WHERE name LIKE ?';
  var inserts = [playerName];
  query = connection.format(query , inserts);
  connection.query(query, function(err, results){
    if(err) return res.status(500).send('Error connecting to database.');
    
    if(results.length !== 0) return res.status(400).send('This name has already been used.');
    
    query = 'INSERT INTO players (name) VALUES(?)';
    inserts = [playerName];
    query = connection.format(query , inserts);
    connection.query(query, function(err){
      if(err) return res.status(500).send('Error inserting into the database.');
      
      return res.status(201).send("Added player: " + playerName);
    });
  });
});

router.post('/checkName', function(req, res, next){
  var playerName = req.body.value;
  if(playerName === undefined || playerName.length === 0)
  {
    return res.status(400).send('Must give player name.');
  }
  
  var query = 'SELECT name FROM players WHERE name LIKE ?';
  var inserts = [playerName];
  query = connection.format(query , inserts);
  connection.query(query, function(err, results){
    if(err) return res.status(500).send('Error connecting to database.');
    
    if(results.length !== 0) return res.status(400).send('This name has already been used.');
    
    return res.status(200).send();
  });
});

module.exports = router;