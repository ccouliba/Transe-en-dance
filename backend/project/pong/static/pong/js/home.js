window.trans = '/static/pong/js/translations/en.json';
tmp_trans = null;

function loadTranslations(newLang) {
	const langFile = newLang === 'fr' ? '/static/pong/js/translations/fr.json' : 
	newLang === 'es' ? '/static/pong/js/translations/es.json' :
	'/static/pong/js/translations/en.json'; // Default to English if neither French nor Spanish
	console.log(langFile);
	tmp_trans = langFile;
	console.log("tmp_trans: " + tmp_trans);
	return fetch(langFile)
	.then(response => response.json())
	.then(trans => {
		window.trans = trans;
	})
	.catch(error => {
		console.error('Error fetching translations:', error);
	})
}

function Home() {
	if (tmp_trans == null)
		loadTranslations(tmp_trans);
    console.log("Translations:", window.trans);
		const defaultMessage = "Welcome Home";
   
		// Use the fetched welcome message if available, otherwise fall back to the default message
		const welcomeMessage = window.trans?.welcome || defaultMessage;

		return `
		<div>
			<h1>${welcomeMessage}</h1>
		</div>
		<button class="btn btn-primary mb-3" onclick="loadHome('es')">Spanish</button>
		<button class="btn btn-primary mb-3" onclick="loadHome('en')">English</button>
		<button class="btn btn-primary mb-3" onclick="loadHome('fr')">French</button>`
		;
}

function loadHome(newLang) {
	// const langFile = newLang === 'fr' ? '/static/pong/js/translations/fr.json' : 
	// newLang === 'es' ? '/static/pong/js/translations/es.json' :
	// '/static/pong/js/translations/en.json'; // Default to English if neither French nor Spanish
	// console.log("prefLang: " + newLang);
	// console.log("langFile: " + langFile);
	// window.trans = langFile;
	// console.log("window.trans: " + window.trans);
	loadTranslations(newLang).then(() => {
		document.getElementById('app').innerHTML = Home();
	});
}

// loadTranslations().then(() => {
// 	document.getElementById('app').innerHTML = Home();
// });

