#!/bin/bash

# Demarrer la base de donnees avec Docker
echo "Demarrage de la base de donnees..."
docker-compose up -d db

# Attendre quelques secondes pour s'assurer que la base de donnees est bien demarree
sleep 10

# Naviguer vers le repertoire du projet
cd "$(dirname "$0")/project"

# Essayer de lancer le serveur Django
echo "Lancement du serveur Django..."
SECRET_KEY=foo python3 manage.py runserver

# Verifier si une erreur specifique est survenue
if [ $? -ne 0 ]; then
  error_message=$(SECRET_KEY=foo python3 manage.py runserver 2>&1)
  if echo "$error_message" | grep -q "django.core.exceptions.ImproperlyConfigured: Error loading psycopg2 or psycopg module"; then
    echo "Erreur detectee: $error_message"
    echo "Installation de psycopg2-binary..."
    pip install psycopg2-binary
    echo "Relance du serveur Django..."
    SECRET_KEY=foo python3 manage.py runserver
  else
    echo "Une autre erreur est survenue :"
    echo "$error_message"
  fi
fi
