#presenter => presente tes entites metiers 
#entite metier = entite contient la logique metier (ex tournament est une entite metier)

def get_rankings(matches, aliases):
	rankings = {}
	
	for match in matches:
		player1 = match['player1']['username']
		player2 = match['player2']['username']
		
		# Initialiser les joueurs s'ils n'existent pas encore dans les rankings
		if player1 not in rankings:
			rankings[player1] = {'username': player1, 'alias': aliases.get(player1), 'wins': 0, 'total_score': 0}
		if player2 not in rankings:
			rankings[player2] = {'username': player2, 'alias': aliases.get(player2), 'wins': 0, 'total_score': 0}
		
		# Mettre à jour les scores totaux
		rankings[player1]['total_score'] += match['player1_score']
		rankings[player2]['total_score'] += match['player2_score']
		
		# Mettre à jour les victoires si le match est terminé
		if match['status'] == 'finished':
			if match['player1_score'] > match['player2_score']:
				rankings[player1]['wins'] += 1
			elif match['player2_score'] > match['player1_score']:
				rankings[player2]['wins'] += 1
			# En cas d'égalité, on ne compte pas de victoire
	
	# Convertir le dictionnaire en liste et trier par victoires puis par score total
	sorted_rankings = sorted(
		rankings.values(),
		key=lambda x: (x['wins'], x['total_score']),
		reverse=True
	)
	
	return sorted_rankings



def get_matches(aliases, composed_games):
	
	matches = [
		{
			'id': cg.game.id,
			'player1': {
				'username': cg.game.player1.username,
				'alias': aliases.get(cg.game.player1.username)
			},
			'player2': {
				'username': cg.game.player2.username,
				'alias': aliases.get(cg.game.player2.username)
			},
			'player1_score': cg.game.player1_score,
			'player2_score': cg.game.player2_score,
			'status': cg.game.status,
			'is_tournament_game': cg.game.is_tournament_game
		} for cg in composed_games
	]
	
	return matches
