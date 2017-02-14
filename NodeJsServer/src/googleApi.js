var apiKey = process.env.API_KEY;
var apiCx = process.env.API_CX;
var google = require('googleapis');
var customSearch = google.customsearch('v1');

var winston = require('winston');

function searchOnGoogle(searchTerms, callback) {
    winston.info("Searching on google with terms: ");
    winston.debug(searchTerms);
    customSearch.cse.list({cx: apiCx, q: searchTerms.query, auth:apiKey, extraTerms: searchTerms.extra, num:1}, function(error, result) {
        if (error) {
            winston.error(error);
            callback(error);
        }

        winston.info("Recieved response!");
        callback(null, result);
    });
}

function filterResponse(response, callback) {
    winston.info("Filtering response:");

    filtered = response.items[0].snippet;
    split = filtered.split(".");
    for (i in split) {
        winston.info("\"" + split[i] + "\"");
    }

    callback(null, split[0]);
}

module.exports = {
    searchOnGoogle: searchOnGoogle,
    filterResponse: filterResponse
}
