'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

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

var server = http.createServer(app);
server.listen(80);