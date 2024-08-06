
// function Home() {
// 	return `
// 	<div>
// 		<h1>${gettext("Welcome home")}</h1>
// 	</div>
// 	<button class="btn btn-primary mb-3" onclick="MyTranslateText()">Spanish</button>`;
// }

// function MyTranslateText() {
	// console.log("MyTranslateText called")
	// alert(gettext("This is a test message"))
	// return fetch('/static/pong/js/translations/es.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         return data;
    //     });
// }

// loadTranslationScript(function() {
//     function Home() {
//         return `
//         <div>
//             <h1>${gettext("Welcome home")}</h1>
//         </div>`;
//     }

//     document.addEventListener('DOMContentLoaded', function() {
//         document.body.innerHTML = Home();
//     });
// });
var prefLang = 'en'
function loadTranslations(language) {
	const langFile = language === 'fr' ? '/static/pong/js/translations/fr.json' : 
                    language === 'es' ? '/static/pong/js/translations/es.json' :
                    '/static/pong/js/translations/en.json'; // Default to French if neither English nor Spanish
					return fetch(langFile)
        .then(response => response.json())
        .catch(error => console.error('Error fetching translations:', error));
}

function Home(translations) {
    // return `
    // <div>
    //     <h1>${translations.welcome}</h1>
    // </div>`;
	    // Provide a default welcome message
		const defaultMessage = "Welcome home";
   
		// Use the fetched welcome message if available, otherwise fall back to the default message
		const welcomeMessage = translations?.welcome || defaultMessage;

		return `
		<div>
			<h1>${welcomeMessage}</h1>
		</div>
		<button class="btn btn-primary mb-3" onclick="loadHome('es')">Spanish</button>
		<button class="btn btn-primary mb-3" onclick="loadHome('en')">English</button>
		<button class="btn btn-primary mb-3" onclick="loadHome('fr')">French</button>`
		;
}

// Home();
function loadHome(language) {
	// var cookie = getCookie();
	// console.log(navigator.languages);
	console.log("In loadHome before: " + prefLang);
	prefLang = language;
	console.log("In loadHome after: " + prefLang);
    loadTranslations(prefLang).then(translations => {
        document.getElementById('app').innerHTML = Home(translations);
    });
}

// Call the function to load content
loadHome(language);
