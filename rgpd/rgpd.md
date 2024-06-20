# Partie 1 : Implementation a faire

#### Front 

- Avant de remplir formulaire de collecte de donnees (ie inscription du user) : 
    - prevoir une modale pour informer :
        - l'utilisateur de l'app de ce qui sera fait de ses donnees 
        - il peut faire opposition et demander l'effacement de ses donnees grace a un formulaire
        - il n'y a pas de traitement de leurs données à des fins spécifiques, telles que le marketing   direct, lorsqu'ils fournissent des informations. 
    - prevoir des boutons pour recueillir son consentement (apres toutes ces infos)

- Prevoir une page + une maquette pour la politique de confidentialite (a remplir avec du lorem ipsum pour l'instant ou faire generer un truc random par chatgpt)

- Sur la page du profil utilisateur, prevoir 
    - des boutons ou les utilisateurs peuvent rectifier/mettre a jour leurs donnees (ex : changer l'adresse email)
    - un bouton ou l'utilisateur peut demander un rapport complet de ses donnees. S'
    il demande ce rapport, prevoir une page ou on verifie bien son identite (ex : besoin de se relog ?)


#### Backend

- Prevoir une methode ou les utilisateurs peuvent demander un rapport complet de leurs données  personnelles (si possible automatiser cela pour renvoyer un fichier pdf ? )
- Verifier l'identité de l'utilisateur qui fait la demande
- mesure de securite applicative (injections SQL, le Cross-Site Scripting (XSS), et le Cross-Site Request Forgery (CSRF))
- attention a difference entre authentification et autorisation. Ex : accessibilité restreinte aux donnees ex : seulement a l'admin
- effacement des donnees de la BDD automatique ? (retention des donnees max pour 1 an par ex ?)
- Procedure a etablir en cas de violation de donnees ? 

# Partie 2 : Explication RGPD

## I : Protection de l'utilisateur de l'application

### A. Droits des individus

1. **Le droit a l’information**

- demander le consentement avant toute collecte de données. 
Ex : popup pour informer l'utilisateur sur l'usage qui sera fait de ses données et recueillir son accord explicite. Pour nous : afin de jouer au jeu et bouton pour accepter

- prevoir une page de politique de confidentialite a integrer dans le front :
    * l’identité du responsable du fichier qui collecte les données personnelles : notre groupe
    * la finalité du fichier : jouer au pong
    * les destinataires des données : notre groupe encore (pas de traitement des donnees par des tiers)
    * leurs droits (droit d’accès, de rectification, et d’opposition) 


2. **Le droit d'opposition**

- Opposition pour l'utilisation directe : 
Toute personne a le droit de s’opposer, pour des motifs légitimes, au traitement de ses données. 

- Opposition pour l'utilsiation indirecte : 
S’opposer à la réutilisation leurs coordonnées à des fins de sollicitations, notamment commerciales. 

Exemple : 
Integrer au pop up du droit a l'information ?
=> peut faire opposition et demander effacement grace au formulaire
=> qu'il n'y a pas de traitement de leurs données à des fins spécifiques, telles que le marketing direct, lorsqu'ils fournissent des informations. 

3. **Les droits d’acces et de rectification**
- Prevoir une page ou les utilisateurs peuvent demander un rapport complet de leurs données personnelles. 
- Verifier l'identité de l'utilisateur qui fait la demande
- Créez une section dans le profil utilisateur où les utilisateurs peuvent voir toutes les données personnelles et peuvent les rectifier/mettre a jour


### B. Consentement
Le consentement préalable de la personne concernée est notamment requis en cas :
- de collecte de données sensibles ;
- de réutilisation des données à d’autres fins ;
- d'utilisation de cookies pour certaines finalités ;  
- d'utilisation des données à des fins de prospection commerciale par voie électronique.



## II : Nos devoirs en tant que développeur

### A. Sécurité des données
- protocole securise : https
- l'authentification à deux facteurs (2FA)
- securite applicative (injections SQL, le Cross-Site Scripting (XSS), et le Cross-Site Request Forgery (CSRF))

### B. Privacy by design and by default 
Dès la conception (montrer maquettes et tout) et
Par défaut :
- Traitement limité aux données nécessaires
- périodes de stockage courtes
- accessibilité restreinte (seulement admin)

### C. Notification des violations de données
Procedure a etablir en cas de violation de donnees ? 
=> perte de disponibilité, d'intégrité ou de confidentialité, de manière accidentelle ou illicite.


