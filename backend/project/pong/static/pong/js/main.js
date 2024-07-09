document.addEventListener('DOMContentLoaded', () => {
    
    console.log('[DOMContentLoaded] = BEGINNING');
    const app_elem=document.getElementById('app');
    console.log('[app_element.login-form]==>' + app_elem.innerHTML);
	
    const loginForm = app_elem.querySelector('#login-form');
    if (loginForm) {
        console.log('[loginForm.method](1)==>' + loginForm.method);
        
        loginForm.addEventListener('submit', async (event) => {
            console.log('[EVENT on loginForm]');
            event.preventDefault(); // protection for a form
            const formData = new FormData(loginForm);
            console.log('formData[0] ==> ' + formData.get('username'));
            const token = getCookie('crsftoken');
            response = fetch(
                '/api/login', {
                    method: 'POST',
                    body: formData,
                    headers:{
                        'X-CSRFToken': token,
                    },
            })
            .then(response => {
                if (response.ok)
                    return response.json();
            })
            .then(data => {
                console.log('[data.messages] ==>' + data.messages);
            })
            .catch(error => {
                console.log('error with fecth api');
            })
            // loadPage('/home');

        });
    }
});
    // app_elem.addEventListener('DOMContentLoaded', () => {
    //     console.log("\t\t=> WE ARE HERE creating loginForm");
	// 	const loginForm = this.getElementById('login-form');
	// 	console.log('[app_elem.attribute] = ', loginForm.innerText);
    // });

	// 	// Listen for event submit + protection from null_value submission
    //     loginForm.addEventListener('submit', async (event) => {
    //         event.preventDefault();
    //         console.log("[event.attribute]=" + event.innerText);
    //     })
	// 		// Store data thanks to this function FormData
    //         const formData = new FormData(loginForm);
    //         const token = document.cookie('crsftoken');
    //         console.log('[csrf_token]=', token);
    //         const url = '/login';
    //         const response = await fetch(
    //             url, {
    //             method: 'POST',
    //             body: formData,
	// 			headers:{
    //                 'X-CSRFToken': token,
	// 			},
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             if (data.messages === 'success') {
    //                 // Redirigez vers la page d'accueil ou une autre URL appropriée
	// 				console.error('SUCCESS: [data.messages]=', data.messages);
    //                 // window.location.href = data.redirect_url;
    //                 app_elem.innerHTML = data.redirect_url;
    //                 console.error('SUCCESS: [data.redirect_url]=', data.redirect_url);
    //             } else
    //                 console.error('FAILURE: [data.messages]=', data.messages);
    //         } else
    //             console.error('FETCH ERROR, [1response.ok]');
	// 	})
	// })
// });

// Try to fetch an url ; then get its text type (html) and finally replace bay the app.innerHTML (translation style)
async function loadPage(url){
    try{
        const token = getCookie('crsftoken');
        console.log('[csrf_token]=', token);
            // const url = '/login';
        const response = await fetch(
            url, {
                method:'POST',
                body:'formData'
            }
        );
        if (response.ok)
            return response.text();
        else
            alert('[Could NOT reach:]!response.ok' + error.messages);
    }
    catch {
        alert('Something wnt wrong during th fetch' + error.messages);
    }
}

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

// const user = fetch(url, {
// 	method: 'POST',
// 	headers : {
// 		'CRSFToken': X-CSRFToken,
// 	},
// 	body: {}
// })

// function handleLinkClick(event) {
// 	event.preventDefault();
// 	const url = event.target.href;
// 	loadContent(url);
// }
// // template_elem.innerHTML;
// async function loadContent(url) {
// 	try {
// 		const response = await fetch(url);
// 		if (response.ok) {
// 			const data = await response.json();
// 			document.getElementById('content').innerHTML = data.html;
// 			console.log('Inside the loadingPage funcion\n[Loading succeeded !]');
// 			// history.pushState(null, '', url);
// 			// attachLinkHandlers();
// 		} else {
// 			console.error('Failed to load page:', response.status, response.statusText);
// 		}
// 	} catch (error) {
// 		console.error('Error loading page:', error);
// 	}
// };

// async function loadContent() {
// 	try {
// 		const response = await fetch('/pong/register');
// 		if (response.ok) {
// 			const html = await response.text();
// 			console.log("[data.message]=", data.test.message);
// 			console.log("[data.redirect_url]=", data.test.redirect_url);
// 			console.log("[data.html_file]=", data.test.html_file);
// 			console.log("[data.html]=", data.html);
// 			template_elem.innerHTML = data.html;
// 			response.status
// 		}
// 		else {
// 			console.error('Failed to load page:', response.status, response.statusText);
// 		}
// 	} catch (error) {
// 		console.error('Error loading page:', error);
// 	}
// };

// loadContent();

// // Définir les routes et les fonctions de rendu
// let routes = {
// 	home: () => mountComponent(Home),
// 	play: () => mountComponent(Play),
// 	404: () => mountComponent(Page404),
// };

// document.addEventListener(onc)
// // Fonction pour afficher le menu
// // function Menu() {
// // 	return `
// // 		<div>
// // 			<a href="#" onclick="changePage('home')">Home</a>
// // 			<a href="#" onclick="changePage('play')">Play</a>
// // 			<a href="#" onclick="changePage('profile')">Profile</a>
// // 			<a href="#" onclick="changePage('logout')">Déconnexion</a>
// // 			<a href="#" onclick="changePage('user_list')">Liste des utilisateurs - test</a>
// // 		</div>`;
// // }

// function Menu() {
// 	return `
// 		<div>
// 			<a href="#" onclick="changePage('home'); event.preventDefault();">Home</a>
// 			<a href="#" onclick="changePage('play'); event.preventDefault();">Play</a>
// 			<a href="#" onclick="changePage('profile'); event.preventDefault();">Profile</a>
// 			<a href="#" onclick="changePage('logout'); event.preventDefault();">Déconnexion</a>
// 			<a href="#" onclick="changePage('user_list'); event.preventDefault();">Liste des utilisateurs - test</a>
// 		</div>`;
// }

// function Home() {
// 	return `
// 	<div>
// 		${Menu()}
// 		<h1>Welcome home</h1>
// 	</div>`;
// }

// function Play() {
// 	return `
// 	<div>
// 		${Menu()}
// 		<h1>HELLO Play Page</h1>
// 		<p>Tu es sur la page de jeu.</p>
// 	</div>`;
// }

// function Page404() {
// 	return `
// 	<div>
// 		${Menu()}
// 		<h1>my own 404</h1>
// 		<p>Page non trouvée</p>
// 	</div>`;
// }

// // Fonction pour changer de page
// window.changePage = function (pageName) {
// 	// console.log(pageName)
	
// 	if (typeof routes[pageName] === "undefined") {
// 		console.log("page name is undefined so 404")
// 		// Si la page demandée n'existe pas
// 		// routes[404](); // Charger la page 404
// 		mountComponent(Page404)
// 		history.pushState({ page: "page404" }, "", "/404"); // Ajoute à l'historique

// 		return;
// 	}
// 	console.log("what is being pushed", pageName)

// 	routes[pageName](); // Charge la page demandée
// 	let urlMap = {
// 		'home': '/pong/home/',
// 		'play': '/pong/play/',
// 		// 'profile': '/profile/',
// 		// 'logout': '/logout/',
// 		// 'user_list': '/user_list/'
// 	};
// 	console.log("urlMap[pageName]", urlMap[pageName])
// 	history.pushState({ page: pageName }, "", urlMap[pageName]); // Ajoute à l'historique
// 	// history.pushState({ page: pageName }, "", `/${pageName}`); // Ajoute à l'historique

// }
// // Gérer l'événement `popstate`
// window.onpopstate = function(event) {
// 	const page = event.state ? event.state.page : '404';
// 	console.log("in onpopstate",page)
// 	if (routes[page]) {
// 		routes[page](); // Appeler la fonction appropriée pour monter le composant
// 	} else {
// 		routes[404](); // Si la route n'existe pas, afficher la page 404
// 	}
// };

// // Fonction pour monter un composant
// function mountComponent(componentFunction, data) {
// 	// Fonction pour charger un composant dans le div app
// 	document.getElementById("app").innerHTML = componentFunction(data);
// }


// // // Initialiser l'application
// // document.addEventListener('DOMContentLoaded', () => {
// // 	changePage('home'); // Charger la page d'accueil par défaut
// // });


// /////////////////////////////////////////////////////////////////////////////////////////////////

// const home = document.getElementById()
