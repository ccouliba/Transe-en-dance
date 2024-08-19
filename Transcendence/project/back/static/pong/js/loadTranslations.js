window.trans = '';

function getUserLangFromBackend(){
	console.log("pb")
	url = `/pong/api/get-user-locale`
	return httpGetJson(url)	
}

function changeBackendLanguage(locale){
	let url = `/change-locale`
	httpPostJson(url, {locale}).then(translations =>{
		window.trans = translations;
		document.getElementById('app').innerHTML = Profile();
	})
}

function askTranslationToBackend(langFile){

	return httpGetJson(langFile)
	.then(trans => {
		window.trans = trans;
		updateMenu();
	})
	.catch(error => {
		console.error(`${window.trans.errFetchingTranslations}: `, error);
	})
}
// Loads the translations based on the langage given
function loadTranslationFile(lang)
{
	// Get the selectedLanguage or the default language
	if (lang == ""){
		lang = "en"
	}
	let tradFiles = {
		"fr": "/static/pong/js/translations/fr.json",
		"en": "/static/pong/js/translations/en.json",
		"es": "/static/pong/js/translations/es.json"	
	}
	let langFile = tradFiles[lang]	
	
	return askTranslationToBackend(langFile)
	
}

function changeLanguage(newLang) {

	loadTranslationFile(newLang)
}
