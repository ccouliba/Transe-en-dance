
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
window.prefLang = 'en'
window.trans = null;
// function loadTranslations(prefLang) {
// 	const langFile = prefLang === 'fr' ? '/static/pong/js/translations/fr.json' : 
//                     prefLang === 'es' ? '/static/pong/js/translations/es.json' :
//                     '/static/pong/js/translations/en.json'; // Default to French if neither English nor Spanish
// 					return fetch(langFile)
//         .then(response => response.json())
//         .catch(error => console.error('Error fetching translations:', error));
// }
function loadTranslations(prefLang) {
    const langFile = prefLang === 'fr' ? '/static/pong/js/translations/fr.json' : 
                    prefLang === 'es' ? '/static/pong/js/translations/es.json' :
                    '/static/pong/js/translations/en.json'; // Default to English if neither French nor Spanish
    console.log("langFile : " + langFile);
    console.log("Local trans: " + trans);
    return fetch(langFile)
        .then(response => response.json())
        .then(trans => {
            window.trans = trans; // Assign translations to global variable
            // return trans; // Return translations for further processing
        })
        .catch(error => {
            console.error('Error fetching translations:', error);
            // window.trans = {}; // Fallback to empty object on error
            // return {}; // Return empty object
        });
}

function Home() {
    console.log("Translations:", window.trans);
	// console.log("translations in Home: " + window.trans)
    // return `
    // <div>
    //     <h1>${translations.welcome}</h1>
    // </div>`;
	    // Provide a default welcome message
		const defaultMessage = "Welcome home";
   
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

// Home();
function loadHome(newLang) {
	window.prefLang = newLang;
	// var cookie = getCookie();
	// console.log(navigator.languages);
	// console.log("In loadHome before: " + prefLang);
	// prefLang = language;
	// console.log("In loadHome after: " + prefLang);
    loadTranslations(window.prefLang).then(trans => {
        document.getElementById('app').innerHTML = Home(trans);
    });
}

// Call the function to load content
// loadHome(window.prefLang);
Home(window.trans);

// Ensure the script runs after the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', (event) => {
//     loadHome(window.prefLang);
// });