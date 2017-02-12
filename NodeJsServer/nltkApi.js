var winston = require('winston');
var request = require('request');

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

function questionTypeFilter(questionType) {
    var res = "";

    if (questionType.toLowerCase() == "what") {
        res = "definition";
    } else if (questionType.toLowerCase() == "where") {
        res = "location";
    } else if (questionType.toLowerCase() == "when") {
        res = "date";
    } else if (questionType.toLowerCase() == "who") {
        res = "person";
    } else if (questionType.toLowerCase() == "why") {
        res = "reason";
    }

    return res;
}

function parseQuestion(question, callback) {
    winston.info("Sending request to nltk-server...");
    winston.debug(question);
    var dataJson = '{"question" : "' + question + '"}';
    winston.debug(dataJson);
    request({
        url: 'http://localhost:8081/nltk/rest/command',
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: dataJson
      }, function(error, response, body) {
            if (error) {
                callback(err);
            }
            winston.info("Request was successfull!");
            var responseJson = JSON.parse(body);
            callback(null, responseJson);
        });
}

function filterResponse(responseJson, callback) {
    winston.info("Filtering response from nltk...");

    // Todo:
    //  Implement filtering here
    var searchTerms = {};

    searchTerms['query'] = responseJson['question'];

    callback(null, searchTerms);
}

// app.post('/nltk', function(req, res) {
// var filteredByType = filterByType(body, 'Structure Core Noun');
// var toSearch = filteredByType[0].content;
// console.log('[Searching on goolge for', toSearch, ']');
//
// var responseFromGoogle = searchOnGoogle(toSearch, function(err, result) {
//   if (error) {
//     console.log('Error');
//     return error;
//   }
//   res.send(result);
// });
// });
// })

module.exports = {
    parseQuestion: parseQuestion,
    filterResponse: filterResponse
}
