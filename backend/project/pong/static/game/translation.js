
document.addEventListener('DOMContentLoaded', Translate());

const langDict = {
    'en': {
        'Settings': 'Settings',
        'Single player': 'Single player',
        'Multiplayer': 'Multiplayer',
        'Score to reach': 'Score to reach',
        'Ball color': 'Ball color',
        'Palette color': 'Palette color',
        'Background color': 'Background color',
        'Save':'Save',

    },
    'fr': {
        'Settings': 'Paramètres',
        'Single player': '1 contre 1',
        'Multiplayer':'Multijoueur',
        'Score to reach': 'Score pour gagner',
        'Ball color':'Couleur de la balle',
        'Palette color':'Couleur de la palette',
        'Background color':'Couleur du fond',
        'Save':'Sauvegarder',
    },
    'es': {
        'Settings': 'Ajustes',
        'Single player': 'Un solo jugador',
        'Multiplayer': 'Multijugador',
        'Score to reach': 'Puntuación para llegar',
        'Ball color': 'color de la bola',
        'Palette color': 'Color de la paleta',
        'Background color': 'Color de fondo',
        'Save': 'Ahorrar',
    },
    'it': {
        'Settings': 'Impostazioni',
        'Single player': 'Giocatore singolo',
        'Multiplayer': 'Multigiocatore',
        'Score to reach': 'Punteggio da raggiungere',
        'Ball color': 'Colore della palla',
        'Palette color': 'Colore della tavolozza',
        'Background color': 'Colore di sfondo',
        'Save': 'Salva',
    },
    'de': {
        'Settings': 'Einstellungen',
        'Single player': 'Einzelspieler',
        'Multiplayer': 'Mehrspieler',
        'Score to reach': 'Punktzahl zu erreichen',
        'Ball color': 'Kugelfarbe',
        'Palette color': 'Palettenfarbe',
        'Background color': 'Hintergrundfarbe',
        'Save': 'Speichern',
    },
};

// No idea how to do this function
// It is supposed to translate every values of data-language in index.html ????
// fucking JS language

function Translate(language) {
    const elemsToTranslate = document.querySelectorAll('[data-translate]');
    const translatedText = gettext(elem)
    elemsToTranslate.foreach(elem => document.write(gettext(elem.inner)));
};

function TranslateText(elem, text) {
    langCookie = geCookie();
    elem.textContent = getTranslation(langCookie, text);
};

function getCookie(cookieList) {
    let i = 0, cookieLang = navigator.la;  // cookieList = decodeURIComponent(document.cookie);
    for (i in cookieList)
        cookieLang = (cookieList[i] == "language") ? cookieList[i] : cookieLang;
    return cookieLang;
}

function getTranslation(key, val) {
    return ((key, val) => (langDict[key] && langDict[key][val]) ? langDict[key][val] : null);
}

document.addEventListener("DOMContentLoaded", )
// Récupérer la langue actuelle depuis localStorage ou un cookie
// getCookie('language')
// const currentLanguage = navigator.language || localStorage.getItem('language');

// Translate(currentLanguage);

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('data-translate').forEach(function(element) {
        var translatedText = gettext(element.getAttribute('data-translate'));
        element.textContent = TranslateText();
    });
});
