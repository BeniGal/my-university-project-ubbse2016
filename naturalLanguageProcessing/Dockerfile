# Dockerfile for Virtual-Assasitent-Natural-Language-Module

FROM python:3.5

RUN pip3.5 install flask
RUN pip3.5 install nltk

RUN mkdir -p /usr/local/share/nltk_data
RUN python -m nltk.downloader -d /usr/local/share/nltk_data all

RUN mkdir -p /opt/fakanal
COPY ./nltkserver /opt/fakanal

CMD /opt/fakanal/start.sh
