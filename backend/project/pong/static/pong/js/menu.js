
function Menu() {
	return `
		<div class="navbar">
			<a href="#" onclick="changePage('home'); event.preventDefault();">Home</a>
			<a href="#" onclick="changePage('play'); event.preventDefault();">Play</a>
			<a href="#" onclick="changePage('profile'); event.preventDefault();">Profile</a>
			<a href="#" onclick="changePage('logout'); event.preventDefault();">Déconnexion</a>
			<a href="#" onclick="changePage('user_list'); event.preventDefault();">Liste des utilisateurs - test</a>
		</div>`;
}
