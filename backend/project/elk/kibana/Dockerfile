# Utiliser l'image officielle de Kibana
FROM docker.elastic.co/kibana/kibana:8.14.3

USER $USERNAME

# RUN mkdir /usr/share/kibana/config/certs

# COPY ./config/certs/* /usr/share/kibana/config/certs/

# Copier éventuellement vos configurations personnalisées
COPY ./config/kibana.yml /usr/share/kibana/config/

# Changer la propriété des certificats vers l'utilisateur kibana_user
# RUN chown kibana:kibana /usr/share/kibana/config/certs/*

# RUN chmod 600 /usr/share/kibana/config/certs/*

# Exposez le port par défaut d'Elasticsearch
EXPOSE 5601