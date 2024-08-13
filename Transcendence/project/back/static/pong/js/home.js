
// function Home() {
// 	return `
// 		<div class="container">
// 		<div class="home">
// 			<h1 style="text-align: center;" id="homeWelcomeTxt">${window.trans.welcome}</h1>
// 		</div>
// 	</div>`;
// }

function Home() {
	let pageHistory = ['home'];
	let currentIndex = 0;

	// Définition interne des "pages" du tutoriel
	const pages = {
		home: () => generateContent('home'),
		concept: () => generateContent('concept'),
		structure: () => generateContent('structure'),
		navigation: () => generateContent('navigation'),
		history: () => generateContent('history'),
		conclusion: () => generateContent('conclusion')
	};

	// Menu interne pour le tutoriel
	function TutorialMenu() {
		return `
		<div>
			<button onclick="window.homeTutorial.changePage('home')">Accueil</button>
			<button onclick="window.homeTutorial.changePage('concept')">Concept SPA</button>
			<button onclick="window.homeTutorial.changePage('navigation')">Navigation</button>
			<button onclick="window.homeTutorial.changePage('history')">Historique</button>
			<button onclick="window.homeTutorial.changePage('structure')">Structure</button>
			<button onclick="window.homeTutorial.changePage('conclusion')">Conclusion</button>
		</div>
		`;
	}

	function generateContent(pageName) {
		let content = '<div class="container">';
		content += '<h1>Tutoriel SPA</h1>';
		content += TutorialMenu();

		switch(pageName) {
			case 'home':
				content += `
					<h2>Bienvenue dans notre tutoriel SPA</h2>
					<p>Ce tutoriel vous guidera à travers la compréhension et le test de la nature Single-Page Application (SPA) de notre projet.</p>
					<p>Utilisez le menu ci-dessus pour naviguer entre les différentes parties du tutoriel.</p>
				`;
				break;
			case 'concept':
				content += `
					<h2>Qu'est-ce qu'une Single-Page Application ?</h2>
					<p>Une Single-Page Application (SPA) est une application web qui charge une seule page HTML et met à jour dynamiquement cette page lorsque l'utilisateur interagit avec l'application. Dans une SPA :</p>
					<ul>
						<li>Les rechargements de page ne sont pas nécessaires lors de la navigation</li>
						<li>Le contenu est récupéré et affiché dynamiquement</li>
						<li>L'URL change pour refléter la "page" actuelle, mais sans rechargement complet</li>
					</ul>
				`;
				break;
			case 'navigation':
				content += `
					<h2>Navigation dans une SPA</h2>
					<p>Observez comment le contenu change lorsque vous cliquez sur les boutons du menu sans que la page ne se recharge complètement.</p>
					<p>Dans une SPA, la navigation est gérée par JavaScript, qui met à jour le contenu de la page et l'URL.</p>
				`;
				break;
			case 'history':
				content += `
					<h2>Gestion de l'historique</h2>
					<p>Une SPA doit également gérer l'historique du navigateur pour permettre l'utilisation des boutons Précédent et Suivant.</p>
					<p>Essayez d'utiliser les boutons de navigation de votre navigateur après avoir parcouru le tutoriel.</p>
				`;
				break;
			case 'structure':
				content += `
					<h2>Structure du code SPA</h2>
					<p>Notre SPA est structurée de la manière suivante :</p>
					<ul>
						<li>Un seul fichier HTML (base.html) sert de template pour toute l'application</li>
						<li>Tout le contenu HTML est généré dynamiquement par des fonctions JavaScript</li>
						<li>Chaque "page" est en réalité une fonction JavaScript dans un fichier .js séparé</li>
						<li>Le backend utilise des vues Django pour servir l'API et le template de base</li>
						<li>Une mini-librairie SPA personnalisée gère la navigation et le rendu des pages</li>
					</ul>
					<h3>Fonctions clés dans main.js :</h3>
					<ul>
						<li><code>changePage(url)</code> : Gère la navigation entre les "pages"</li>
						<li><code>mountComponent(componentFunction, data)</code> : Rend une nouvelle "page"</li>
						<li><code>bindEvent(state, cssSelector, event, callback)</code> : Attache des événements de manière asynchrone</li>
						<li><code>httpGetJson(url)</code> et <code>httpPostJson(url, payload)</code> : Gèrent les requêtes AJAX</li>
					</ul>
				`;
				break;
			case 'conclusion':
				content += `
					<h2>Conclusion</h2>
					<p>Vous avez parcouru les principes de base d'une Single-Page Application :</p>
					<ul>
						<li>Chargement dynamique du contenu</li>
						<li>Navigation sans rechargement de page</li>
						<li>Gestion de l'historique du navigateur</li>
					</ul>
					<p>Continuez à explorer l'application pour voir ces principes en action !</p>
				`;
				break;
		}


		content += '</div>';
		return content;
	}

	function changePage(pageName, pushState = true) {
		if (pages[pageName]) {
			document.getElementById('app').innerHTML = pages[pageName]();
			if (pushState) {
				if (currentIndex < pageHistory.length - 1) {
					pageHistory = pageHistory.slice(0, currentIndex + 1);
				}
				pageHistory.push(pageName);
				currentIndex = pageHistory.length - 1;
				history.pushState({ index: currentIndex }, '', `#${pageName}`);
			}
			updatePageInfo();
		}
	}

	function updatePageInfo() {
		const currentPageSpan = document.getElementById('currentPage');
		const pageHistorySpan = document.getElementById('pageHistory');
		if (currentPageSpan) currentPageSpan.textContent = pageHistory[currentIndex];
		if (pageHistorySpan) pageHistorySpan.textContent = pageHistory.join(' -> ');
	}

	// Gestion de l'historique
	window.onpopstate = function(event) {
		if (event.state && typeof event.state.index !== 'undefined') {
			currentIndex = event.state.index;
			changePage(pageHistory[currentIndex], false);
		} else {
			changePage('home', false);
		}
	};

	// Rendre les fonctions nécessaires accessibles globalement
	window.homeTutorial = {
		changePage: changePage
	};

	// Initialisation
	return generateContent('home');
}

// Assurez-vous que la fonction Home est accessible globalement
window.Home = Home;