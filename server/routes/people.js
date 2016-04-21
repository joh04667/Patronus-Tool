var router = require('express').Router();
var path = require('path');
var pg = require('pg');

var connectionString = require('../db/connection').connectionString;

// get all people
router.get('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var query = client.query('SELECT * FROM people');
      var results = [];
      query.on('error', function(err){
        console.log(err);
        done();
        response.sendStatus(500);
      });
      query.on('row', function(rowData){
        results.push(rowData);
      });
      query.on('end', function(){
        response.send(results);
        done();
      });
    }
  });
});

// get a single person
router.get('/:id', function(request, response) {
  console.log('Got person:', request.params.id);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
  var query = client.query('SELECT * FROM people WHERE id =' + request.params.id);
  var results = [];
  query.on('error', function(err){
    console.log(err);
    done();
    response.sendStatus(500);
  });
  query.on('row', function(rowData){
    results.push(rowData);
  });
  query.on('end', function(){
    response.send(results);
    done();
  });
}
});
});

// router.post
router.post('/', function(request, response){
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var result = [];
      var first_name = request.body.first_name;
      var last_name = request.body.last_name;
      console.log(request.body);

      var query = client.query('INSERT INTO people (first_name, last_name) VALUES ($1, $2)' + 'RETURNING id, first_name, last_name', [first_name, last_name]);

      query.on('row', function(row){
        result.push(row);
      });
      query.on('end', function() {
        done();
        respone.send(result);
      });

      query.on('error', function(error) {
        console.log('error running query:', error);
        done();
        response.status(500).send(error);

      });
    }
  });
});
module.exports = router;
