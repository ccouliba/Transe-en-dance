/*********************************************************/
/*** SCRIPT FOR TRANSLATING HTML FILE IN JS WORKS FINE ***/
/*** It's supposed to be attached to index.html file  ***/
/*********************************************************/

document.addEventListener('DOMContentLoaded', TranslateText);

const idList = [
    'settingsButton',
    'singlePlayerButton',
    'multiplayerButton',
    'scoreLimitLabel',
    'ballColorLabel',
    'paddleColorLabel',
    'backgroundColorLabel',
    'saveSettingsButton'
];

const langDict = {
    'en': {
        'Settings':'Settings',
        'Single player':'Single player',
        'Multiplayer':'Multiplayer',
        'Score to reach :':'Score to reach :',
        'Ball color :':'Ball color :',
        'Paddle color :':'Paddle color :',
        'Background color :':'Background color :',
        'Save':'Save'

    },
    'fr': {
        'Settings':'Paramètres',
        'Single player':'1 contre 1',
        'Multiplayer':'Multijoueur',
        'Score to reach :':'Score pour gagner :',
        'Ball color :':'Couleur de la balle :',
        'Paddle color :':'Couleur de la palette :',
        'Background color :':'Couleur du fond :',
        'Save':'Sauvegarder'
    },
    'es': {
        'Settings':'Ajustes',
        'Single player':'Un solo jugador',
        'Multiplayer':'Multijugador',
        'Score to reach :':'Puntuación para llegar :',
        'Ball color :':'color de la bola :',
        'Paddle color :':'Color de la paleta :',
        'Background color :':'Color de fondo :',
        'Save':'Ahorrar'
    },
    'it': {
        'Settings': 'Impostazioni',
        'Single player': 'Giocatore singolo',
        'Multiplayer': 'Multigiocatore',
        'Score to reach :': 'Punteggio da raggiungere :',
        'Ball color :': 'Colore della palla : :',
        'Paddle color :': 'Colore della tavolozza :',
        'Background color :': 'Colore di sfondo :',
        'Save': 'Salva'
    },
    'de': {
        'Settings': 'Einstellungen',
        'Single player': 'Einzelspieler',
        'Multiplayer': 'Mehrspieler',
        'Score to reach :': 'Punktzahl zu erreichen :',
        'Ball color :': 'Kugelfarbe :',
        'Paddle color :': 'Palettenfarbe :',
        'Background color :': 'Hintergrundfarbe :',
        'Save': 'Speichern'
    },
};

function getCookie() {
    const cookieList = decodeURIComponent(document.cookie).split(';');
    var cookieLang = navigator.language;
    for (let i = 0; i < cookieList.length; ++i) {
        const cookie = cookieList[i].trim(); 
        if (cookie.startsWith("language=")) {
            cookieLang = cookie.substring("language=".length, cookie.length);
            break;
        }
    }
    return cookieLang || navigator.language;
}

function getTranslation(lang, val) {
    return langDict[lang] && langDict[lang][val] ? langDict[lang][val] : val;
}

function translateElem(elem) {
    const translated = getTranslation(getCookie(), elem.innerText);
    elem.value = elem.innerText = translated;
}

function TranslateText() {
    idList.forEach(idName => {
        let elem = document.getElementById(idName);
        if (elem)
            translateElem(elem);
    });
}
