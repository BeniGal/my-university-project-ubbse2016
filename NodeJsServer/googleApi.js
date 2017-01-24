var apiKey = process.env.API_KEY;
var apiCx = process.env.API_CX;
var google = require('googleapis');
var customSearch = google.customsearch('v1');

var winston = require('winston');

function searchOnGoogle(searchTerms, callback) {
    winston.info("Searching on google with terms: ");
    winston.debug(searchTerms);
  // customSearch.cse.list({cx: apiCx, q: searchTerms.query, auth:apiKey}, function(error, result) {
  //   if (error) {
  //     winston.error(error);
  //     callback(error);
  //   }
  //   winston.info(result);
  //   callback(null, result);
  // })

    searchResult = {"result":"result"};
    callback(null, searchResult);
}

function filterResponse(response, callback) {
    winston.info("Filtering response:");
    winston.debug(response);

    filtered = {"filtered":"filtered"};
    winston.info(filtered);
    callback(null, filtered);
}

module.exports = {
    searchOnGoogle: searchOnGoogle,
    filterResponse: filterResponse
}
