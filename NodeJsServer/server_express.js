'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var google = require('googleapis');
var request = require('request');
var customSearch = google.customsearch('v1');
var apiKey = 'apiKey';
var apiCx = 'apiCx';

var app = express();

// to support URL-encoded bodies
app.use(bodyParser.json());

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

app.post('/nltk', function(req, res) {

  var question = req.body.question;
  var dataJson = '{"question" : "' + question + '"}';
  console.log('[Sending data to nltk module: ' + dataJson + ']');
  request({
    url: 'http://localhost:8080/nltk/rest/command',
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: dataJson
  }, function(error, response, body) {
    if (error) {
      console.log('Error:', error);
      return;
    }
    console.log('Request was succesful!');
    console.log(body);

    res.send(body);
  });
})


function searchByUUID(data, uuid) {

  var dataInJson = JSON.parse(data);
  var arrayToSearch = dataInJson.components;
  var arrayLength = arrayToSearch.length;
  for (var i = 0; i < arrayLength; i++) {
    if (arrayToSearch[i].uuid === uuid) {
      var response = arrayToSearch[i];
    }
  }
  return response;
}

var server = http.createServer(app);
server.listen(9191);
