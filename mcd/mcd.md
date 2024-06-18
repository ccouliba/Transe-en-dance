<img src = "MCD.svg"/>

### MLD 

- **USER**
  - `id_user`
  - `username`
  - `email`
  - `password`
  - `creation_date` (//pour RGPD)
  - `langue` 

- **PLAYER**
  - `id_player` int, cle primaire
  - `avatar` varchar
  - `#id_user` int, cle etrangere (PLAYER)

- **FRIENDSHIP**
  - `#id_player1` int, cle etrangere (PLAYER)
  - `#id_player2` int, cle etrangere (PLAYER)

- **PLAY**
  - `#id_player` int, cle etrangere (PLAYER)
  - `#id_game` int, cle etrangere (GAME)

- **GAME**
  - `id_game` int, cle primaire
  - `date` datetime
  - `#winner_id` int, cle etrangere (PLAYER)
  - `score` int
  - `status`varchar (game.started, game.finished, game.canceled)

- **PARTICIPATE**
  - `#id_player` int, cle etrangere (PLAYER)
  - `#id_tournament` int, cle etrangere (TOURNAMENT)
  - `order_of_turn` int
  - `alias` varchat

- **TOURNAMENT**
  - `id_tournament` int, cle primaire
  - `name` varchat
  - `is_started` boolean
  - `#winner_id` int, cle etrangere (PLAYER)

- **COMPOSED**
  - `#id_tournament` int, cle etrangere (TOURNAMENT)
  - `#id_game` int, cle etrangere (GAME)
  - `game_number` 


### Methodes  
Chaque evenement metier = endpoint

- notes : 
Un player peut debuter une partie 1v1 :
player.started_a_game
Un player peut debuter un tournoi :
player.started_a_tournament

**Une demande d'ami est automatique ou peut etre refuse ?**
Un player devient ami avec un autre player:
player.became_friend_with(other_player)

**quand est ce qu'une partie est perdue ? quand la balle est perdue des la 1ere fois ? point de vie ?**
game.is_won_by(player) 

- liste des methodes

Inscription et gestion des utilisateurs :
user.registered
user.logged_in
user.updated_profile
user.password_changed
user.account_deleted

Gestion des joueurs et des parties :
player.started_a_game
player.started_a_tournament
game.is_won_by(player)
game.started
game.finished
game.score_updated
game.canceled

Friend:
player.became_friend_with(other_player)
player.sent_friend_request
player.accepted_friend_request
player.refused_friend_request

Participation aux tournois :
tournament.player_joined
tournament.started
tournament.finished




### Notes  

Mocodo script
```

USER: id_user, username, email, password
IS, 11 USER,  11 PLAYER
PARTICIPATE, 1N TOURNAMENT, 1N PLAYER: order_of_turn, alias
TOURNAMENT: id_tournament, name, is_started, start_date, end_date
:

FRIENDSHIP, 0N [friend] PLAYER, 0N [friend_of] PLAYER
PLAYER: id_player, avatar
PLAY, 0N PLAYER, 1N GAME
GAME: id_game, date, winner_id
COMPOSED, 1N TOURNAMENT, 1N GAME: game_number

```

<!-- ```

TOURNAMENT: id tournament, name, is_started, start date, end date
PARTICIPATE, 1N TOURNAMENT, 1N PLAYER: order_of_turn, alias
:

COMPOSED, 1N TOURNAMENT, 1N GAME: game_number
PLAYER: id player
FRIENDSHIP, 0N [friend] PLAYER, 0N [friend_of] PLAYER

GAME: id game, date,winner_id,  is_started, start date, end date
PLAY, 0N PLAYER, 1N GAME
:

``` -->
