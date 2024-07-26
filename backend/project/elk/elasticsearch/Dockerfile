# Utiliser l'image officielle d'Elasticsearch
FROM docker.elastic.co/elasticsearch/elasticsearch:8.14.3

RUN mkdir /usr/share/elasticsearch/config/certs

# Générez un certificat auto-signé et une clé privée
RUN openssl req -x509 -nodes -out /usr/share/elasticsearch/config/certs/ssl.crt -keyout /usr/share/elasticsearch/config/certs/ssl.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=ccouliba.42.fr/UID=ccouliba"

# Copier éventuellement vos configurations personnalisées
COPY ./config/elasticsearch.yml /usr/share/elasticsearch/config/

# Exposez le port par défaut d'Elasticsearch
EXPOSE 9200
# Pour les connextions de noeud a noeud
# EXPOSE 900

# Définisser la commande par défaut (peut être ignorée si vous utilisez l'image officielle)
CMD ["elasticsearch"]

# docker build -t my-elasticsearch .
# docker run -p 9200:9200 -p 9300:9300 -d my-elasticsearch