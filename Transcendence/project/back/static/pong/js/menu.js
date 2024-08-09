function Menu() {
	const isLoggedIn = localStorage.getItem('userToken') === 'true';
	return `
		<div class="menuStructureTop">
			${isLoggedIn ? `
				<li class="nav-item flex-grow-1 text-center">
					<a class="nav-link" aria-current="page" href="#play" id="navbarPlayLink" onclick="changePage('#play'); return false;">Play</a>
				</li>
				<li class="nav-item flex-grow-1 text-center">
					<a class="nav-link" aria-current="page" href="#tournament" id="navbarTournamentLink" onclick="changePage('#tournament'); return false;">Tournament</a>
				</li>
				<li class="nav-item flex-grow-1 text-center">
					<a class="nav-link" aria-current="page" href="#profile" id="navbarProfileLink" onclick="changePage('#profile'); return false;">Profile</a>
				</li>
				<li class="nav-item flex-grow-1 text-center">
					<a class="nav-link" aria-current="page" href="#friends" id="navbarFriendsLink" onclick="changePage('#friends'); return false;">Friends</a>
				</li>
				<li class="nav-item flex-grow-1 text-center">
					<a class="nav-link" aria-current="page" href="#match_history" id="navbarHistoryLink" onclick="changePage('#match_history'); return false;">Match history</a>
				</li>
				</ul>
				<ul class="navbar-nav ms-auto">
					<li class="nav-item">
						<a class="nav-link" aria-current="page" href="#" onclick="logout(); return false;" id="navbarLogoutLink">Log Out</a>
					</li>
				</ul>
			` : `
			`}
		</div>
	`;
}
// a voir si jamais pas logged in, ce que l'on veut afficher