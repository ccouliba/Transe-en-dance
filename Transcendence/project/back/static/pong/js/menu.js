function Menu() {
    const isLoggedIn = localStorage.getItem('userToken') === 'true';
    return `
    <div class="menuStructureTop">
        ${isLoggedIn ? `
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-custom">
            <div class="container-fluid">
            <a class="navbar-brand active" href="#home" onclick="changePage('#home'); hideCanvas(); return false;" id="navbarHomeLink">${window.trans.home}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbar">
                        <ul class="navbar-nav d-flex justify-content-between w-100">
                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#play" id="navbarPlayLink" onclick="changePage('#play'); hideCanvas(); return false;">${window.trans.play}</a>
                            </li>
                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#ia" id="iaLink" onclick="toggleCanvas(); changePage('#ia'); return false;">
									${window.trans.singlePlayer}
                                </a>
                            </li>

                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#tournament" id="navbarTournamentLink" onclick="changePage('#tournament'); hideCanvas(); return false;">${window.trans.tournament}</a>
                            </li>
                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#profile" id="navbarProfileLink" onclick="changePage('#profile'); hideCanvas();  return false;">${window.trans.profile}</a>
                            </li>
                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#friends" id="navbarFriendsLink" onclick="changePage('#friends'); hideCanvas(); return false;">${window.trans.friends}</a>
                            </li>
                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#match_history" id="navbarHistoryLink" onclick="changePage('#match_history'); hideCanvas(); return false;">${window.trans.matchHistory}</a>
                            </li>
                            <li class="nav-item flex-grow-1 text-center">
                                <a class="nav-link" aria-current="page" href="#privacy_policy" id="navbarPrivacyPolicy" onclick="changePage('#privacy_policy'); hideCanvas(); return false;">${window.trans.privacyPolicy}</a>
                            </li>
                        </ul>
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" aria-current="page" href="#logout" id="navbarLogoutLink" onclick="changePage('#logout'); hideCanvas(); return false;">${window.trans.logOut}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        ` : `
        `}
    </div>
    `;
}

// a voir si jamais pas logged in, ce que l'on veut afficher