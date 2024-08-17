window.trans = '';

// Loads the translations based on the langage given
function loadTranslations(newLang)
{
	// Get the selectedLanguage or the default language
	newLang = localStorage.getItem('selectedLanguage') || "English";
	// By default the English translations are given
	let langFile = '/static/pong/js/translations/en.json';
	// French translations are given
	if (newLang === 'Français')
		langFile = '/static/pong/js/translations/fr.json';
	// Spanish translations are given
	else if (newLang === 'Español')
		langFile = '/static/pong/js/translations/es.json';
	// Fetch the translation file
	return fetch(langFile)
	// Parse the content of the translation file
	.then(response => response.json())
	// Store the contents in a global object
	.then(trans => {
		window.trans = trans;
	})
	// Write an error in the console if the fetching fails
	.catch(error => {
		console.error(`${window.trans.errFetchingTranslations}: `, error);
	})
}

// Applies the translations and loads necessary pages
function changeLanguage(newLang) {
	// Loads the translations
	loadTranslations(newLang).then(() => {
		// Updates the navbar
		updateMenu();
		// Loads the profile with the new translations
		document.getElementById('app').innerHTML = Profile();
	});
}
