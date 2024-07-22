function Menu() {
	const isLoggedIn = localStorage.getItem('userToken') === 'true';
	return `
		<nav class="navbar">
			${isLoggedIn ? `
				<a href="#home" onclick="changePage('#home'); return false;">Home</a>
				<a href="#play" onclick="changePage('#play'); return false;">Play</a>
				<a href="#tournament" onclick="changePage('#tournament'); return false;">Tournament</a>
				<a href="#profile" onclick="changePage('#profile'); return false;">Profil</a>
				<a href="#friends" onclick="changePage('#friends'); return false;">Friends</a>
				<a href="#" onclick="logout(); return false;">Logout</a>
				<a href="#ia" onclick="changePage('#ia'); event.preventDefault();">IA</a>
			` : `
				
			`}
		</nav>
	`;
}

// a voir si jamais pas logged in, ce que l'on veut afficher