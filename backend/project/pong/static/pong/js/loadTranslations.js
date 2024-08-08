window.trans = '/static/pong/js/translations/en.json';

// function setLanguageCookie(language) {
//     var d = new Date();
//     d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Cookie valid for 1 year
//     var expires = "expires=" + d.toUTCString();
//     document.cookie = "language=" + language + ";" + expires + ";path=/";
// }

function loadTranslations(newLang) {
	let langFile = '/static/pong/js/translations/en.json';
	if (newLang === 'fr')
		langFile = '/static/pong/js/translations/fr.json';
	else if (newLang === 'es')
		langFile = '/static/pong/js/translations/es.json';
	
	// setLanguageCookie(newLang);
	return fetch(langFile)
	.then(response => response.json())
	.then(trans => {
		window.trans = trans;
	})
	.catch(error => {
		console.error('Error fetching translations:', error);
	})
}

function changeLanguage(newLang) {
	loadTranslations(newLang).then(() => {
		updateMenu();
		document.getElementById('app').innerHTML = Home();
	});
}
