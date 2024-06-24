
document.addEventListener('DOMContentLoaded', function() {
    const translations = {
        'en': {
            'Settings': 'Settings',
            'Single player': 'Single player',
            'Multiplayer': 'Multiplayer',
            'Score to reach': 'Score to reach',
            'Ball color': 'Ball color',
            'Palette color': 'Palette color',
            'Background color': 'Background color'
        },
        'fr': {
            'Settings': 'Paramètres',
            'Single player': '1 contre 1',
            'Multiplayer':'Multijoueur',
            'Score to reach': 'Score pour gagner',
            'Ball color':'Couleur de la balle',
            'Palette color':'Couleur de la palette',
            'Background color':'Couleur du fond'
        },
        'es': {
            'Settings': 'Ajustes',
            'Single player': 'Un solo jugador',
            'Multiplayer': 'Multijugador',
            'Score to reach': 'Puntuación para llegar',
            'Ball color': 'color de la bola',
            'Palette color': 'Color de la paleta',
            'Background color': 'Color de fondo'
        },
        'it': {
            'Settings': 'Impostazioni',
            'Single player': 'Giocatore singolo',
            'Multiplayer': 'Multigiocatore',
            'Score to reach': 'Punteggio da raggiungere',
            'Ball color': 'Colore della palla',
            'Palette color': 'Colore della tavolozza',
            'Background color': 'Colore di sfondo'
        },
        'de': {
            'Settings': 'Einstellungen',
            'Single player': 'Einzelspieler',
            'Multiplayer': 'Mehrspieler',
            'Score to reach': 'Punktzahl zu erreichen',
            'Ball color': 'Kugelfarbe',
            'Palette color': 'Palettenfarbe',
            'Background color': 'Hintergrundfarbe'
        },
    };

    // No idea how to do this function
    // It is supposed to translate every text that follows the data-language tag ????
    // fucking JS language
    function Translate(language) {
    }

    // Récupérer la langue actuelle depuis localStorage ou un cookie
    const currentLanguage = getCookie('language') || localStorage.getItem('language');

    Translate(currentLanguage);
});
