window.trans = '/static/pong/js/translations/en.json';
window.tmp_trans = null;

function loadTranslations(newLang) {
	var langFile = '/static/pong/js/translations/en.json';
	if (newLang === 'fr')
		langFile = '/static/pong/js/translations/fr.json';
	else if (newLang === 'es')
		langFile = '/static/pong/js/translations/es.json';
	// Necessary to make sure loadTranslations is only called the first time the Home function is called
	window.tmp_trans = langFile;
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
