// document.addEventListener('DOMContentLoaded', () => {
//     const canvas = document.getElementById('pong-canvas');
//     // const ctx = canvas.getContext('2d');
//     const startGameBtn = document.getElementById('start-game');

//     let gameId = null;
//     let player1Score = 0;
//     let player2Score = 0;

//     startGameBtn.addEventListener('click', () => {
//         startGame();
//     });

//     function startGame() {
//         fetch('/pong/start_game/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': getCookie('csrftoken')
//             },
//             body: JSON.stringify({
//                 opponent_id: 2  // Remplacez par l'ID de l'adversaire
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             gameId = data.game_id;
//             console.log('Game started with ID:', gameId);
//             // Commencez le jeu ici (affichez les scores, etc.)
//         });
//     }

//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }

//     // Fonction pour mettre à jour le score
//     function updateScore(playerId, newScore) {
//         fetch('/pong/update_score/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': getCookie('csrftoken')
//             },
//             body: JSON.stringify({
//                 game_id: gameId,
//                 player_id: playerId,
//                 new_score: newScore
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'score_updated') {
//                 console.log('Score updated for game ID:', gameId);
//                 // Mettez à jour l'affichage du score ici
//             }
//         });
//     }

//     // Autres fonctions pour terminer et annuler le jeu peuvent être ajoutées ici de manière similaire
// });
