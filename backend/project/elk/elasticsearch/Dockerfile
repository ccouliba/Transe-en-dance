# Utiliser l'image officielle d'Elasticsearch
FROM docker.elastic.co/elasticsearch/elasticsearch:8.14.3

# RUN mkdir /usr/share/elasticsearch/config/certs

# RUN mkdir /usr/share/elasticsearch/config

# COPY ./config/certs/* /usr/share/elasticsearch/config/certs/

# Copier éventuellement vos configurations personnalisées
COPY ./config/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Exposez le port par défaut d'Elasticsearch
EXPOSE 9200

# Pour les connextions de noeud a noeud
EXPOSE 9300

# Définir la commande par défaut (peut être ignorée si vous utilisez l'image officielle)
CMD ["elasticsearch"]
