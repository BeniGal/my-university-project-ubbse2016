var winston = require('winston');

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

function parseQuestion(question, callback) {
    winston.info("Sending request to nltk-server...");
    winston.debug(question);
    var response = {"response":"response"};
    callback(null, response);
}

function filterResponse(response, callback) {
    winston.info("Filtering response from nltk...");
    winston.debug(response);
    var filtered = {"filtered":"filtered"};
    callback(null, filtered);
}

// app.post('/nltk', function(req, res) {
//
//   var question = req.body.question;
//   var dataJson = '{"question" : "' + question + '"}';
//   console.log('[Sending data to nltk module: ' + dataJson + ']');
//   request({
//     url: 'http://localhost:8080/nltk/rest/command',
//     method: 'POST',
//     headers: {
//       'Content-Type' : 'application/json'
//     },
//     body: dataJson
//   }, function(error, response, body) {
//     if (error) {
//       console.log('Error:', error);
//       return;
//     }
//     console.log('[Request was succesful]');
//     var responseJson = JSON.parse(body);
//
//     var filteredByType = filterByType(body, 'Structure Core Noun');
//     var toSearch = filteredByType[0].content;
//     console.log('[Searching on goolge for', toSearch, ']');
//
//     var responseFromGoogle = searchOnGoogle(toSearch, function(err, result) {
//       if (error) {
//         console.log('Error');
//         return error;
//       }
//       res.send(result);
//     });
//   });
// })

module.exports = {
    parseQuestion: parseQuestion,
    filterResponse: filterResponse
}
