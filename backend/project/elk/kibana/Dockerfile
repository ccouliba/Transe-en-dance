# Utiliser l'image officielle de Kibana
FROM docker.elastic.co/kibana/kibana:8.14.3

# Copier éventuellement vos configurations personnalisées
COPY ./config/kibana.yml /usr/share/kibana/config/

# Exposez le port par défaut d'Elasticsearch
EXPOSE 5601
# Pour les connextions de noeud a noeud
# EXPOSE 900
