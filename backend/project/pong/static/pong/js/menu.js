// Fonction pour générer le HTML du menu
function Menu() {
    const isLoggedIn = localStorage.getItem('userToken') === 'true';
    return `
        <nav class="navbar">
            ${isLoggedIn ? `
                <a href="#home" onclick="changePage('#home'); hideCanvas(); return false;">Home</a>
                <a href="#play" onclick="changePage('#play'); hideCanvas(); return false;">Play</a>
                <a href="#tournament" onclick="changePage('#tournament'); hideCanvas(); return false;">Tournament</a>
                <a href="#profile" onclick="changePage('#profile'); hideCanvas(); return false;">Profil</a>
                <a href="#friends" onclick="changePage('#friends'); hideCanvas(); return false;">Friends</a>
                <a href="#" onclick="logout(); hideCanvas(); return false;">Logout</a>
                <a href="#ia" id="ia" onclick="toggleCanvas(); changePage('#ia'); return false;">Single player</a>
            ` : `
                
            `}
        </nav>
    `;
}