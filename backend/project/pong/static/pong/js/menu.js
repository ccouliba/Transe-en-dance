function Menu() {
	const isLoggedIn = localStorage.getItem('userToken') === 'true';
	return `
		<div class="menuStructureTop">
		<nav class="navbar navbar-expand-lg navbar-custom menuStructureTop">
			${isLoggedIn ? `
\			<div class="container-fluid">
				<a class="navbar-brand active" href="#home" onclick="changePage('#home'); return false;" id="navbarHomeLink"; >Home</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"
					aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbar">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a class="nav-link" aria-current="page" href="#play" id="navbarPlayLink" onclick="changePage('#play'); return false;">Play</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" aria-current="page" href="#tournament"
								id="navbarTournamentLink" onclick="changePage('#tournament'); return false;">Tournament</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" aria-current="page" href="#profile"
								id="navbarProfileLink" onclick="changePage('#profile'); return false;">Profile</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" aria-current="page" href="#friends"
								onclick="changePage('#friends'); return false;" id="navbarFriendsLink">Friends</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" aria-current="page" href="#" onclick="logout(); return false;"
								id="navbarLogoutLink">Log Out</a>
						</li>
						<li class="nav-item">
							<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true"
								id="navbarDisabled">Disabled</a>
							<!-- possibilite de rendre le bouton desactive selon l'etat du user (enrengistre ou pas, ect)-->
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</div>
	` : `
				
			`}
		</nav>
	`;
}