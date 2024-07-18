
// function Menu() {
// 	return `
// 		<div class="navbar">
// 			<a href="#home" onclick="changePage('#home'); event.preventDefault();">Home</a>
// 			<a href="#play" onclick="changePage('#play'); event.preventDefault();">Play</a>
			
// 			<a href="#play" onclick="changePage('#tournament'); event.preventDefault();">Tournament</a>

// 			<a href="#profile" onclick="changePage('#profile'); event.preventDefault();">Profil</a>
// 			<a href="#friends" onclick="changePage('#friends'); event.preventDefault();">Friends list</a>
// 			<a href="#logout" onclick="changePage('#logout'); event.preventDefault(); ">Logout</a>
// 		</div>`;
// }

function Menu() {
	const isLoggedIn = localStorage.getItem('userToken') === 'true';
	return `
		<nav class="navbar">
			${isLoggedIn ? `
				<a href="#home" onclick="changePage('#home'); return false;">Home</a>
				<a href="#play" onclick="changePage('#play'); return false;">Play</a>
				<a href="#tournament" onclick="changePage('#tournament'); return false;">Tournament</a>
				<a href="#profile" onclick="changePage('#profile'); return false;">Profil</a>
				<a href="#friends" onclick="changePage('#friends'); return false;">Friends list</a>
				<a href="#" onclick="logout(); return false;">Logout</a>
			` : `
				<a href="#login" onclick="changePage('#login'); return false;">Login</a>
				<a href="#register" onclick="changePage('#register'); return false;">Register</a>
			`}
		</nav>
	`;
}