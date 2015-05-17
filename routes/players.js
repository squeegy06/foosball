var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next){
  var query = 'SELECT * FROM players ORDER BY name ASC';
  connection.query(query, function(err, results){
    if(err) return res.status(500).send('Error connecting to database.');
    
    res.status(200).render('allPlayers' , {players: results});
  });
});

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

router.get('/player/:id(\\d+)', getPlayer ,function(req, res){
  if(res.locals.player === undefined || res.locals.player.length === 0){
    return res.status(404).send('Player not found');
  }
  
  if(req.query.json){
    var player = {player_name: res.locals.player.name};
    res.render('playerBody', {player: res.locals.player}, function(err, html){
      if(err) return res.status(500).send('An error occured rendering the response.');
      
      player.player_body = html;
      
      res.render('playerFooter', {player: res.locals.player}, function(err, html){
        if(err) return res.status(500).send('An error occured rendering the response.');
        
        player.player_footer = html;
        
        res.status(200).json(player);
      });
    });
  }else{
    res.status(200).send('Regular response');
  }
});

router.post('/delete/:id(\\d+)', getPlayer, function(req, res){
  if(res.locals.player === undefined || res.locals.player.length === 0){
    return res.status(404).send('Player not found');
  }
  
  var query = 'UPDATE players SET deleted = 1 WHERE id = ' + res.locals.player.id;
  connection.query(query, function(err, results){
    if(err) return res.status(500).send('Error connecting to database.');
    
    res.status(200).send('Deleted player: ' + res.locals.player.name);
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

function getPlayer(req, res, next){
  var player_id = req.params.id;
  var query = 'SELECT * FROM players WHERE id = ?';
  var inserts = [player_id];
  query = connection.format(query , inserts);
  connection.query(query, function(err, results){
    if(err) return res.status(500).send('Error connecting to database.');
    
    res.locals.player = results[0];
    next();
  });
}

module.exports = router;