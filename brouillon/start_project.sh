#!/bin/bash

#Notamment pour liberer port 8000 si besoin
echo "Arret et suppression des conteneurs existants..."
docker-compose down

# Demarrer la base de donnees avec Docker
echo "Demarrage de la base de donnees..."
docker-compose up -d db

# Attendre quelques secondes pour s'assurer que la base de donnees est bien demarree
sleep 10

# Naviguer vers le repertoire du projet
cd "$(dirname "$0")/project"

# Installation de psycopg2 si necessaire 
#(Psycopg is the most popular PostgreSQL database adapter for the Python programming language)
echo "Installation de psycopg2 si necessaire"
pip install psycopg2-binary

# Essayer de lancer le serveur Django
echo "Lancement du serveur Django..."
SECRET_KEY=foo python3 manage.py runserver
