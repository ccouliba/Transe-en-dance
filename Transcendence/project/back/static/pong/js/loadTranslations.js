window.trans = null;

function loadTranslations(newLang) {
	newLang = localStorage.getItem('selectedLanguage');
	let langFile = '/static/pong/js/translations/en.json';
	if (newLang === 'Français')
		langFile = '/static/pong/js/translations/fr.json';
	else if (newLang === 'Español')
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
		updateMenu();
		document.getElementById('app').innerHTML = Profile();
	});
}
