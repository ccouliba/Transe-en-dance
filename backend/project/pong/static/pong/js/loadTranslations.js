window.trans = '/static/pong/js/translations/en.json';

function loadTranslations(newLang) {
	let langFile = '/static/pong/js/translations/en.json';
	if (newLang === 'fr')
		langFile = '/static/pong/js/translations/fr.json';
	else if (newLang === 'es')
		langFile = '/static/pong/js/translations/es.json';
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
		document.getElementById('app').innerHTML = Home();
	});
}
