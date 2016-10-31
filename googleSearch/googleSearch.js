var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var google = require('googleapis');
var customSearch = google.customsearch('v1');
var apiKey = 'apiKey';
var apiCx = 'apiCx';

app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log('[Main endpoint]');
  res.send('Welcome!');
})

app.post('/googleSearch', function(req, res) {

  var toSearch = req.body.sentence;
  console.log('[Searching for',toSearch,']');
  customSearch.cse.list({cx: apiCx, q: toSearch, auth:apiKey}, function(error, result) {
    if (error) {
      console.log('Error');
      return;
    }
    res.status(200).send(result);
  })
})

var server = app.listen(9191, function() {
  var port = server.address().port;
  console.log("[Listening on: http://localhost:%s]", port);
});
