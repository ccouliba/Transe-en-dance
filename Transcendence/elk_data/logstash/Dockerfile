# pull official base image
FROM docker.elastic.co/logstash/logstash:8.15.0

# set work directory
WORKDIR /usr/share/logstash/pipeline

RUN rm -rf /usr/share/logstash/pipeline/*

COPY ./pipeline/logstash.conf .
COPY ./pipeline/logstash2.conf .

EXPOSE 5959
