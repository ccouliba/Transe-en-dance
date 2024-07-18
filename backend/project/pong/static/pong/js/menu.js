
function Menu() {
	return `
		<div class="navbar">
			<a href="#home" onclick="changePage('#home'); event.preventDefault();">Home</a>
			<a href="#play" onclick="changePage('#play'); event.preventDefault();">Play</a>
			
			<a href="#play" onclick="changePage('#tournament'); event.preventDefault();">Tournament</a>

			<a href="#profile" onclick="changePage('#profile'); event.preventDefault();">Profil</a>
			<a href="#friends" onclick="changePage('#friends'); event.preventDefault();">Friends list</a>
			<a href="#logout" onclick="changePage('#logout'); event.preventDefault(); ">Logout</a>
		</div>`;
}


