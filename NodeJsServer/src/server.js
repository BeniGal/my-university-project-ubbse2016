'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');

var async = require('async');
var winston = require('winston');
require('./log')();

var nltkApi = require('./nltkApi');
var googleApi = require('./googleApi');

var port = process.env.NODE_PORT || 8080;
var app = express();
app.use(bodyParser.json());

app.post('/hello/world/endpoint', function (request, response) {
    var message = request.body.message;
    winston.info('Got request with message ' + message);

    response.send('Hello, World!');
});

app.post('/googleSearch', function (req, res) {

    var toSearch = req.body.question;
    winston.info(toSearch);

    async.waterfall([
        async.constant(toSearch),
        nltkApi.parseQuestion,
        nltkApi.filterResponse,
        googleApi.searchOnGoogle,
        googleApi.filterResponse,
        function (filtered, callback) {
            winston.info("Turning filtered response into answer...");
            winston.debug(filtered);

            var answer = { "response": filtered };
            callback(null, answer);
        }
    ], function (err, response) {
        if (err) {
            if (response) {
                winston.debug(response);
                var answer = { "response": response };
                res.status(200).send(answer);
            } else {
                winston.error(err);
                res.status(500).send("Internal Server Error");
            }
        } else {
            winston.debug(response);
            res.status(200).send(response);
        }
    });
});

var server = http.createServer(app);
server.listen(port);
winston.info("Server started on port " + port);
