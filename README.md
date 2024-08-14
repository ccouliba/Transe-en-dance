# ft_transcendance 

## Les tests 

Attention : pour les tests, essayer avec tous les types d'utilisateurs (enregistrement manuel vs. API 42)

### 1. Page d'inscription 

-  Créer un nouvel utilisateur
-  Vérifier que le nouvel utilisateur apparaît dans la base de données

### 2. Page de connexion 

-  Se connecter avec OAuth via l'API 42
-  Vérifier que les mots de passe n'apparaissent pas en clair dans l'URL

### 3. Page de jeu

-  Vérifier que le premier joueur est bien l'utilisateur actuel (comparer avec la page de profil)
-  Tester l'entrée du deuxième joueur :
    -  Avec un utilisateur inexistant
    -  Avec un utilisateur existant
-  Jouer une partie :
    -  Avec un utilisateur enregistré manuellement
    -  Avec un utilisateur enregistré via l'API 42
-  Vérifier la mise à jour des statistiques dans la page de profil
-  Vérifier la mise à jour de l'historique des matchs
-  Vérifier la mise à jour des informations sur le profil de l'autre joueur (statistiques et historique des matchs)

### 4. Page du tournoi

-  Essayer de lancer un tournoi sans ajouter de joueur
-  Tenter d'ajouter un joueur inexistant
-  Attribuer un alias à un joueur
-  Inclure un utilisateur enregistré via l'API 42
-  Organiser un tournoi avec au moins 3 joueurs
-  Tenter de terminer un tournoi avant que tous les matchs soient joués

### 5. Page de profile

-  Modifier toutes les informations d'un utilisateur :
    -  Nom
    -  Prénom
    -  Avatar
    -  Mot de passe
    -  Langues
    -  etc. 
-  Vérifier la mise à jour des informations dans la base de données
-  Tester la suppression du compte
-  Répéter toutes ces opérations avec un utilisateur enregistré via l'API 42

### 6. Page des amis

-  Ajouter un ami
-  Accepter une demande d'ami
-  Supprimer un ami
-  Vérifier le statut en ligne/hors ligne des amis
-  Répéter toutes ces opérations avec un utilisateur enregistré via l'API 42



## Nos modules

### Web
  - Majeur : Backend (Django)
  - mineur : Frontend (Bootstrap)
  - mineur : Database (Postgres)
### Gestion utilisateur
  - Majeur : Gestion utilisateur standard, authentification, utilisateurs en tournois.
  - Majeur : Implémenter une authentification à distance (API42)
### IA-algo
  - Majeur : IA
### Securite
  - mineur : RGPD
### Devops
  - Majeur : Journaux de log
### Modules Accessibilite
  - mineur : Multi-langues