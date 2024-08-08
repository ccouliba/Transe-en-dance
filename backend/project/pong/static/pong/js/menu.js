function Menu() {
	const isLoggedIn = localStorage.getItem('userToken') === 'true';
	return `
		<nav class="navbar">
			${isLoggedIn ? `
				<a href="#home" onclick="changePage('#home'); return false;">${window.trans.home}</a>
				<a href="#play" onclick="changePage('#play'); return false;">${window.trans.play}</a>
				<a href="#tournament" onclick="changePage('#tournament'); return false;">${window.trans.tournament}</a>
				<a href="#profile" onclick="changePage('#profile'); return false;">${window.trans.profile}</a>
				<a href="#friends" onclick="changePage('#friends'); return false;">${window.trans.friends}</a>
				<a href="#profile" onclick="changePage('#match_history'); return false;">${window.trans.matchHistory}</a>
				<a href="#" onclick="logout(); return false;">${window.trans.logOut}</a>
			` : `
				
			`}
		</nav>
	`;
}

// a voir si jamais pas logged in, ce que l'on veut afficher