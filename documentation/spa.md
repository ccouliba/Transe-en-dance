# Documentation du système SPA

## Aperçu général

Ce système permet de créer une Single Page Application (SPA) en utilisant JavaScript vanilla. Il gère le routage, le chargement des composants et la gestion des états pour différentes pages.

## Fichier main.js

### Fonctions principales

1. `loadCSS(filename)`
   - Charge dynamiquement un fichier CSS.
   - Utilisation : `loadCSS("chemin/vers/votre/fichier.css")`

2. `bindEvent(state, cssSelector, event, callback)`
   - Attache un événement à un élément DOM de manière asynchrone.
   - Utilisation : `bindEvent(monEtat, "#monBouton", "click", maFonction)`

3. `resetLoaded()`
   - Réinitialise l'état 'isLoaded' de tous les composants.

4. `changePage(url)`
   - Change la page actuelle et met à jour l'historique du navigateur.
   - Utilisation : `changePage("#profile")`

5. `mountComponent(componentFunction, data)`
   - Charge un composant dans le div 'app'.
   - Utilisation : `mountComponent(Profile)`

### Configuration des routes

Les routes sont définies dans l'objet `routes`. Chaque clé correspond à un chemin, et la valeur est une fonction qui monte le composant associé.

## Gestion des composants (ex: profile.js, play.js)

### Structure d'un composant

Chaque composant (comme Profile ou Play) doit avoir :
- Un objet d'état (ex: `profileState`, `playState`)
- Une fonction principale qui retourne le HTML du composant
- Des fonctions auxiliaires pour gérer les interactions et les mises à jour

### Exemple avec profile.js

1. Définir l'état :
   ```javascript
   var profileState = {
     username: "",
     email: "",
     // ... autres propriétés
     isLoaded: false
   }
   ```

2. Créer la fonction principale du composant :
   ```javascript
   function Profile() {
     loadProfileFromBackend()
     return `
       ${Menu()}
       <div class="container">
         // ... HTML du profil
       </div>
     `
   }
   ```

3. Implémenter des fonctions pour les interactions :
   ```javascript
   function EditUsername() {
     bindEvent(profileState, "#edit-username", "submit", event => {
       // ... logique de mise à jour
     })
     return `
       // ... HTML du formulaire
     `
   }
   ```

### Utilisation dans l'application

1. Ajouter le composant aux routes dans main.js :
   ```javascript
   let routes = {
     "#profile": () => mountComponent(Profile),
     // ... autres routes
   }
   ```

2. Pour naviguer vers le composant :
   ```javascript
   changePage("#profile")
   ```

## Conseils d'utilisation

- Assurez-vous que chaque composant gère correctement son état 'isLoaded'.
- Utilisez `bindEvent` pour attacher des événements de manière fiable.
- Pour les mises à jour d'état qui nécessitent un re-rendu, appelez `mountComponent` après la mise à jour.

