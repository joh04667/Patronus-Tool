var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');

var connectionString = require('../db/connection').connectionString;

// get all patroni
router.get('/', function(request, response) {
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var query = client.query('SELECT * FROM patroni');
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

// get a single patronus
router.get('/:id', function(request, response) {
  console.log('Got patronus:', request.params.id);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
  var query = client.query('SELECT * FROM patroni WHERE id =' + request.params.id);
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
  console.log('request get', request.body);
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
      response.sendStatus(500);
    } else {
      var result = [];
      var patronus_name = request.body.patronus_name;
      console.log(request.body);

      var query = client.query('INSERT INTO patroni (patronus_name) VALUES ($1)' + 'RETURNING id, patronus_name', [patronus_name]);

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
