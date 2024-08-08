FROM docker.elastic.co/logstash/logstash:8.9.0

# WORKDIR /usr/src/logstash

# ENV USER root

# # Supprimer les configs par defaut
# # Sans cela logstash ne prend pas nos configs (pipelines etc ..)
# RUN rm -rf /usr/share/logstash/pipeline/
# RUN rm -rf /usr/share/logstash/config/

# # RUN mkdir pipeline
# # RUN mkdir config/

# # RUN echo "user = "$(whoami)
# # RUN chown $(whoami) /usr/share/logstash/config/

# # RUN chmod -R 777 /usr/share/logstash/config/

# # RUN chmod -R 777 ./config/logstash/config/*
# # Copie de nos configurations
# COPY ./pipeline .
# COPY ./config .

# # RUN chmod -R 755 /usr/share/logstash/config/logstash.yml
# # RUN chmod -R 755 /usr/share/logstash/pipeline/pipelines.yml