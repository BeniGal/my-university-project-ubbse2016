#!/bin/bash

docker login -u fakanal -p fakanal

# run nltk
docker run --hostname fakanl-nltk --name fakanal-nltk -d fakanal/nltk:1.1

# run node
docker run --name fakanal-main -e API_KEY="AIzaSyD6DEq0jhmNqT55KcuWsAG673kIVerJAi8" -e API_CX="017188541386240305514:wqzgsxq14ui" -e NLTK_SERVER="http://fakanal-nltk:80" -d -p 80:8080 --link fakanal-nltk:fakanal-nltk fakanal/main:1.0
