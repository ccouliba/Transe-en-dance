
// Declare un objet 'IAState' pour stocker les informations de l'IA
var IAState = {

}

// La fonction IA pour générer le contenu HTML
function IA() {
    return `
        ${Menu()}
        <div>
            test
            <canvas id="myCanvas" width="800" height="400" style="border:1px solid #000000;">
                Error
            </canvas>
        </div>
    `;
}

// Fonction pour dessiner sur le canvas
function drawOnCanvas() {
    var canvas = document.getElementById("myCanvas");
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(100, 50, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
    } else {
        console.error("Le canvas n'a pas pu être trouvé ou le contexte n'est pas supporté.");
    }
}

// Fonction pour vider le canvas
function clearCanvas() {
    var canvas = document.getElementById("myCanvas");
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        console.error("Le canvas n'a pas pu être trouvé ou le contexte n'est pas supporté.");
    }
}
/*
// Ajout d'un gestionnaire d'événements pour la touche 'Espace'
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        clearCanvas();
    }
});

// Appel de la fonction pour charger le composant IA et dessiner sur le canvas
function mountIA() {
    document.getElementById("app").innerHTML = IA();
    drawOnCanvas();
}

// Ajout de la route pour la page IA
let routes = {
    "#home": () => mountComponent(Home),
    "#play": () => mountComponent(Play),
    "#profile": () => mountComponent(Profile),
    "#friends": () => mountComponent(FriendsList),
    "#404": () => mountComponent(Page404),
    "#tournament": () => mountComponent(Tournament),
    "#ia": () => mountIA()  // Appel de la fonction mountIA pour cette route
    // login: () => mountComponent(Login),
};

// Fonction pour changer de page
window.changePage = function (url) {
    if (url === "#play") {
        playState.isLoaded = false;
    }
    if (typeof routes[url] === "undefined") {
        mountComponent(Page404)
        history.pushState({ page: "#404" }, "", "#404"); // Ajoute à l'historique
        return;
    }
    routes[url](); // Charge la page demandée
    history.pushState({ page: url }, "", url); // Ajoute à l'historique
}

// Gérer l'événement `popstate`
window.onpopstate = function(event) {
    // resetLoaded()
    const page = event.state ? event.state.page : '404';
    if (routes[page]) {
        routes[page](); // Appeler la fonction appropriée pour monter le composant
    } else {
        mountComponent(Page404); // Si la route n'existe pas, afficher la page 404
    } 
};

// Fonction pour monter un composant
function mountComponent(componentFunction, data) {
    // Fonction pour charger un composant dans le div app qui se trouve dans base.html
    document.getElementById("app").innerHTML = componentFunction(data);
}
*/