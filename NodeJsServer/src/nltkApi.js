var winston = require('winston');
var request = require('request');

var nltkServer = process.env.NLTK_SERVER || "http://localhost:8080"

function contains(entry, type) {
    for (i in entry) {
        if (entry[i] === type) {
            return true;
        }
    }

    return false;
}

function matchesTypes(entry, type) {
    for (var i = 0; i != type.length; i++) {
        if (contains(entry["type"], type[i]) == false) {
            return false;
        }
    }

    return true;
}

function filterByType(data, type) {

    var result = [];
    for (var i = 0; i != data.length; i++) {
        if (matchesTypes(data[i], type) == true)
            result.push(data[i]);
    }

    return result;
}

function searchByUUID(dataInJson, uuid) {

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
    else res = undefined;

    return res;
}

function parseQuestion(question, callback) {
    winston.info("Sending request to nltk-server...");
    winston.debug(question);
    var dataJson = '{"question" : "' + question + '"}';
    winston.debug(dataJson);

    request({
        url: nltkServer + '/nltk/rest/command',
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: dataJson
      }, function(error, response, body) {
            if (error) {
                winston.error(error);
                callback(error);
            }
            winston.info("Request was successfull!");
            winston.debug(body);
            var responseJson = JSON.parse(body);
            callback(null, responseJson);
        });
}

function filterResponse(responseJson, callback) {
    winston.info("Filtering response from nltk...");

    comps = responseJson.components;
    for (var i = 0; i != comps.length; i++) {
        winston.debug(comps[i]);
    }

    // Todo:
    //  Implement filtering here
    var searchTerms = {}

    var elements = filterByType(responseJson.components, "Root")[0]["elements"];
    var resp = "";
    for (i = 0; i != elements.length; ++i) {
        var elem = searchByUUID(responseJson, elements[i]);
        if (matchesTypes(elem, ["Structure", "Core"]) == true) {
            resp = resp + elem.content + ",";
        }
    }
    winston.debug("resp is: " + resp);
    searchTerms['query'] = resp;
    var questionType = filterByType(responseJson.components, ["Question", "Type"]);
    if (questionType.length == 0) {
        searchTerms['extra'] = undefined;
    } else {
        searchTerms['extra'] = questionTypeFilter(questionType[0].content);
    }
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
