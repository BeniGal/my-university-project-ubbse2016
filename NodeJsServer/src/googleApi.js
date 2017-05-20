var apiKey = process.env.API_KEY;
var apiCx = process.env.API_CX;
var google = require('googleapis');
var customSearch = google.customsearch('v1');

var winston = require('winston');

function searchOnGoogle(searchTerms, callback) {
    winston.info("Searching on google with terms: ");
    winston.debug(searchTerms);
    if (!searchTerms.query) {
        callback('error', "Sorry I didn't understand that");
        return;
    }
    customSearch.cse.list({ cx: apiCx, q: searchTerms.query, auth: apiKey, extraTerms: searchTerms.extra, num: 3 }, function (error, result) {
        if (error) {
            winston.error(error);
            callback(error);
        }

        winston.info("Recieved response!");
        result['extra'] = searchTerms.extra;
        callback(null, result);
    });
}

function filterResponse(response, callback) {
    winston.info("Filtering response:");
    winston.debug(response.items[0].snippet);

    filtered = response.items[0].snippet;
    winston.info('Snippet:', filtered);
    resp = filter(filtered);

    callback(null, resp);
}

function firstToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}

function filter(filtered) {

    regexp = /[,]/
    splitted = "";
    split = filtered.split(regexp);
    for (i in split) {
        if (split[i]) {
            if (!split[i].includes("...")) {
                if (i != 0) {
                    split[i] = firstToLowerCase(split[i]);
                }
                split[i] += ",";
                split[i] = split[i].replace(/\n/g, "");
                splitted = splitted + split[i];
            }
        }
    }
    splitted = splitted.split(/[.]/);
    if (splitted[0].substr(splitted[0].length - 1) == ',') {
        resp = splitted[0].slice(0, -1);
    } else {
        resp = splitted[0];
    }

    if (resp == "") {
        resp = "I don't know";
    }

    return resp;
}

module.exports = {
    searchOnGoogle: searchOnGoogle,
    filterResponse: filterResponse,
    firstToLowerCase: firstToLowerCase,
    filter: filter
}
