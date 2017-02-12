from flask import Flask, request, Response, jsonify
from questionParser import QuestionParser
import os

app = Flask(__name__)

# set debugging
debug = False
if os.getenv('FVA_DEBUG', False) == 'true':
    debug = True
# set url base
urlBase = "/nltk/rest"


@app.route("/")
def index():
    return "Welcome to the Fakanal Virtual Assistant Homepage!!!"


@app.route("%s/command" % urlBase, methods=['GET', 'POST'])
def command():

    if request.headers.get('Content-Type') is not None:
        if request.headers.get('Content-Type') == 'application/json':
            body = request.get_json(silent=True)
            question = body.get('question')
            parser = QuestionParser(question)

            return Response(parser.parse_question(), mimetype="application/json")
    else:
        return jsonify({"message": "Content type unset or not supported!", "code": 400}), 400


@app.errorhandler(500)
@app.errorhandler(404)
@app.errorhandler(401)
def http_error_handler(error):
    return jsonify({"code": error.code, "message": str(error)}), error.code

if __name__ == "__main__":
    app.run(debug=debug,
            host="0.0.0.0",
            port=80)
