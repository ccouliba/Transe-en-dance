# Utiliser l'image officielle de Logstash
FROM docker.elastic.co/logstash/logstash:8.14.3

# USER $USERNAME

WORKDIR /usr/share/logstash/pipeline
# RUN mkdir /usr/share/logstash/config

# # Je copie certificat et cle dans le conteneur
# COPY ./config/certs/* /usr/share/logstash/config/certs/
# RUN chmod 600 /usr/share/logstash/certs/*

# Je copie ma config et ma pipeline  dans le conteneur
# COPY ./config/logstash.yml /usr/share/logstash/config/logstash.yml
COPY ./pipeline/logstash.conf .

# Je change le propriétaire du fichier de configuration Logstash pour éviter les problèmes de permissions
# RUN chown logstash:logstash /usr/share/logstash/config/logstash.yml
# RUN chown logstash:logstash /usr/share/logstash/pipeline/logstash.conf

# Exposez le port que Logstash utilisera pour recevoir les logs
EXPOSE 5959
