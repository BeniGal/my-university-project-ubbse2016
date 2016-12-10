'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var google = require('googleapis');
var customSearch = google.customsearch('v1');
var apiKey = 'apiKey';
var apiCx = 'apiCx';

var app = express();

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/hello/world/endpoint', function(request, response) {

  var message = request.body.message;
  console.log('Got request with message ' + message);

  response.send('Hello, World!');
});

app.post('/googleSearch', function(req, res) {

  var toSearch = req.body.sentence;
  console.log('[Searching for',toSearch,']');
  customSearch.cse.list({cx: apiCx, q: toSearch, auth:apiKey}, function(error, result) {
    if (error) {
      console.log('Error');
      return;
    }
    res.send(result);
  })
});

// TODO: implement connection to nltk module

var server = http.createServer(app);
server.listen(80);
