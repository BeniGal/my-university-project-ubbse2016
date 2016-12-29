'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var google = require('googleapis');
var request = require('request');
var customSearch = google.customsearch('v1');
var apiKey = 'AIzaSyD6DEq0jhmNqT55KcuWsAG673kIVerJAi8';
var apiCx = '017188541386240305514:wqzgsxq14ui';

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
    console.log('[Request was succesful]');
    var responseJson = JSON.parse(body);

    var filteredByType = filterByType(body, 'Structure Core Noun');
    var toSearch = filteredByType[0].content;
    console.log('[Searching on goolge for', toSearch, ']');

    var responseFromGoogle = searchOnGoogle(toSearch, function(err, result) {
      if (error) {
        console.log('Error');
        return error;
      }
      res.send(result);
    });
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

function filterByType(data, type) {

  var dataInJson = JSON.parse(data);
  var arrayToSearch = dataInJson.components;
  var arrayLength = arrayToSearch.length;
  var responseArray = [];
  var item = 0;
  for (var i = 0; i < arrayLength; i++) {
    if (arrayToSearch[i].type === type) {
      responseArray[item] = arrayToSearch[i];
      item++;
    }
  }
  return responseArray;
}

function searchOnGoogle(toSearch, callback) {

  console.log('[Searching for',toSearch,']');
  customSearch.cse.list({cx: apiCx, q: toSearch, auth:apiKey}, function(error, result) {
    if (error) {
      console.log('Error');
      callback(error);
    }
    console.log('Google:', result);
    callback(null, result);
  })
}

var server = http.createServer(app);
server.listen(80);
