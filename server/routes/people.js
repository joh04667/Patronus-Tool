var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');

var connectionString = require('../db/connection').connectionString;

// get all people
router.get('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var unmatched = [];
      var matched = [];
      var unmatchedQuery = client.query('SELECT * FROM people WHERE patronus_id IS NULL;');
      var matchedQuery = client.query('SELECT * FROM people JOIN patroni ON patronus_id = patroni.id  WHERE patronus_id IS NOT NULL;');

      unmatchedQuery.on('error', function(err){
        console.log(err);
        done();
        response.sendStatus(500);
      });
      matchedQuery.on('error', function(err){
        console.log(err);
        done();
        response.sendStatus(500);
      });

      unmatchedQuery.on('row', function(rowData){
        unmatched.push(rowData);
      });
      unmatchedQuery.on('end', function(){
        matchedQuery.on('row', function(rowData){
          matched.push(rowData);
        });
        matchedQuery.on('end', function(){
          response.send([unmatched, matched]);
          done();
        });
      });
    }
  });
});

// update a person
router.put('/:id', function(request, response) {
  console.log('Got person:', request.params.id, 'with patronus', request.body);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
  var query = client.query('UPDATE people SET patronus_id =($1) WHERE id =($2)', [request.body.id,  request.params.id]);
  console.log('query is', query);

  query.on('error', function(err){
    console.log(err);
    done();
    response.sendStatus(500);
  });

    response.send('updated');
    done();
   }
  });
 });

// router.post
router.post('/', function(request, response){
  console.log('request', request.body);
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
        response.send(result);
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
