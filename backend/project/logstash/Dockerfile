# Utilisez l'image officielle de Logstash
FROM docker.elastic.co/logstash/logstash:8.9.0

USER $USERNAME

# Je supprime le fichier de configuration Logstash existant dans le conteneur
# Pas necessaire car la copie qui suit ecrase mais bon ...
RUN rm -f /usr/share/logstash/config/logstash.yml

# Je copie mon fichier de configuration Logstash dans le conteneur
COPY ./config/logstash.yml /usr/share/logstash/config/logstash.yml
# Je copie mon pipeline Logstash dans le conteneur
COPY ./pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf

# Je change le propriétaire du fichier de configuration Logstash pour éviter les problèmes de permissions
RUN chown logstash:logstash /usr/share/logstash/config/logstash.yml
RUN chown logstash:logstash /usr/share/logstash/pipeline/logstash.conf

# Exposez le port que Logstash utilisera pour recevoir les logs
EXPOSE 5959
