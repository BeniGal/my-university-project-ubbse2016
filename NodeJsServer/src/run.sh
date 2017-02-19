#!/bin/bash

export API_KEY="AIzaSyD6DEq0jhmNqT55KcuWsAG673kIVerJAi8"
export API_CX="017188541386240305514:wqzgsxq14ui"
export NLTK_SERVER="http://localhost:8080"
export NODE_PORT=8081

node server.js

unset API_KEY
unset API_CX
unset NLTK_SERVER
unset NODE_PORT
