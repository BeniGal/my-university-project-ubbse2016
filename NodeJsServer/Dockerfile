FROM node:latest

RUN mkdir -p /opt/fakanal
COPY ./src /opt/fakanal
RUN cd /opt/fakanal && npm install

CMD cd /opt/fakanal && node server.js
