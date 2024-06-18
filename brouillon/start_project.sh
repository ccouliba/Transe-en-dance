
# #!/bin/bash

# # Demarrer la base de donnees avec Docker
# echo "Demarrage de la base de donnees..."
# docker-compose up -d db

# # Attendre quelques secondes pour s'assurer que la base de donnees est bien demarree
# sleep 10

# # Naviguer vers le repertoire du projet de maniere relative
# cd "$(dirname "$0")/project"

# # Verifier si le changement de repertoire a reussi
# if [ $? -ne 0 ]; then
#   echo "Erreur : le repertoire du projet n'existe pas."
#   exit 1
# fi

# # Liberer le port 8000 s'il est occupe
# PORT=8000
# PID=$(lsof -t -i:$PORT)

# if [ -n "$PID" ]; then
#   echo "Le port $PORT est utilise par le processus $PID. Arret du processus..."
#   kill $PID
#   # Verifier si le processus a bien ete arrete
#   sleep 2
#   if kill -0 $PID 2>/dev/null; then
#     echo "Le processus $PID n'a pas pu etre arrete. Forcage de l'arret..."
#     kill -9 $PID
#   fi
#   echo "Le port $PORT est maintenant libre."
# fi

# # Essayer de lancer le serveur Django sur le port 8000
# echo "Lancement du serveur Django sur le port $PORT..."
# SECRET_KEY=foo python3 manage.py runserver $PORT

# # Verifier si une erreur specifique est survenue
# if [ $? -ne 0 ]; then
#   error_message=$(SECRET_KEY=foo python3 manage.py runserver $PORT 2>&1)
#   if echo "$error_message" | grep -q "django.core.exceptions.ImproperlyConfigured: Error loading psycopg2 or psycopg module"; then
#     echo "Erreur detectee: $error_message"
#     echo "Installation de psycopg2-binary..."
#     pip install psycopg2-binary
#     echo "Relance du serveur Django sur le port $PORT..."
#     SECRET_KEY=foo python3 manage.py runserver $PORT
#   else
#     echo "Une autre erreur est survenue :"
#     echo "$error_message"
#   fi
# fi

#!/bin/bash
echo "Arret et suppression des conteneurs existants..."
docker-compose down

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

# # Verifier si une erreur specifique est survenue
# if [ $? -ne 0 ]; then
#   error_message=$(SECRET_KEY=foo python3 manage.py runserver 2>&1)
#   if echo "$error_message" | grep -q "django.core.exceptions.ImproperlyConfigured: Error loading psycopg2 or psycopg module"; then
#     echo "Erreur detectee: $error_message"
#     echo "Installation de psycopg2-binary..."
#     pip install psycopg2-binary
#     echo "Relance du serveur Django..."
#     SECRET_KEY=foo python3 manage.py runserver
#   else
#     echo "Une autre erreur est survenue :"
#     echo "$error_message"
#   fi
# fi
