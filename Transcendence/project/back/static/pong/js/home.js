
// function Home() {
// 	return `
// 		<div class="container">
// 		<div class="home">
// 			<h1 style="text-align: center;" id="homeWelcomeTxt">${window.trans.welcome}</h1>
// 		</div>
// 	</div>`;
// }


function Home() {
	function TutorialMenu() {
		return `
		<div>
			<button onclick="changePage('home')">${window.trans.home}</button>
			<button onclick="changePage('concept')">${window.trans.SPAConcept}</button>
			<button onclick="changePage('navigation')">${window.trans.nav}</button>
			<button onclick="changePage('history')">${window.trans.history}</button>
			<button onclick="changePage('structure')">${window.trans.structure}</button>
			<button onclick="changePage('conclusion')">${window.trans.conclusion}</button>
		</div>
		`;
	}

	function HomeComponent() {
		return `
			<h2>${window.trans.welcomeSPATutorial}</h2>
			<p>${window.trans.thisTutorial}</p>
			<p>${window.trans.useManu}</p>
		`;
	}

	function ConceptComponent() {
		return `
			<h2>${window.trans.whatIsSPA}</h2>
			<p>${window.trans.SPAIs}</p>
			<ul>
				<li>${window.trans.pageRefreshNotNecessary}</li>
				<li>${window.trans.contentIsCollected}</li>
				<li>${window.trans.URLChange}</li>
			</ul>
		`;
	}

	function NavigationComponent(){
		return `
			<h2>${window.trans.SPANav}</h2>
			<p>${window.trans.observeContent}</p>
			<p>${window.trans.inSPA}</p>
		`;
	}

	function HistoryComponent(){
		return `
			<h2>${window.trans.historyHandle}</h2>
			<p>${window.trans.historyHandling}</p>
			<p>${window.trans.tryUsing}</p>
		`;

	}

	function StructureComponent(){
		return `
			<h2>${window.trans.SPAStructure}</h2>
			<p>${window.trans.ourSPA}</p>
			<ul>
				<li>${window.trans.oneHTML}</li>
				<li>${window.trans.allHTML}</li>
				<li>${window.trans.eachPage}</li>
				<li>${window.trans.backendUses}</li>
				<li>${window.trans.miniLibSPA}</li>
			</ul>
			<h3>${window.trans.keyFunctions}</h3>
			<ul>
				<li><code>changePage(url)</code> : ${window.trans.changePage}</li>
				<li><code>mountComponent(componentFunction, data)</code> : ${window.trans.mountComponent}</li>
				<li><code>bindEvent(state, cssSelector, event, callback)</code> : ${window.trans.bindEvent}</li>
				<li><code>httpGetJson(url)</code> ${window.trans.and} <code>httpPostJson(url, payload)</code> : ${window.trans.httpFunctions}</li>
			</ul>
		`;
	}

	function ConclusionComponent() {
		return `
			<h2>${window.trans.conclusion}</h2>
			<p>${window.trans.youBrowsed}</p>
			<ul>
				<li>${window.trans.dynamicLoad}</li>
				<li>${window.trans.navigationWithoutReload}</li>
				<li>${window.trans.navHistory}</li>
			</ul>
			<p>${window.trans.keepOnExploring}</p>
		`;
	}

	function Page404Component() {
		return `
			${TutorialMenu()}
			<div>404 - Page non trouvée</div>    
		`;
	}

	let pages = {
		home: () => mountComponent(HomeComponent),
		concept: () => mountComponent(ConceptComponent),
		navigation: () => mountComponent(NavigationComponent),
		history: () => mountComponent(HistoryComponent),
		structure: () => mountComponent(StructureComponent),
		page404: () => mountComponent(Page404Component),
		conclusion: () => mountComponent(ConclusionComponent)
	};

	function changePage(pageName) {
		if (typeof pages[pageName] === "undefined") {
			mountComponent(Page404);
			history.pushState({ page: "page404" }, "", "page404");
			return;
		}
		pages[pageName]();
		history.pushState({ page: pageName }, '', pageName);
	}

	function mountComponent(componentFunction) {
		document.getElementById("app").innerHTML = TutorialMenu() + componentFunction();
	}

	window.onpopstate = function(event) {
		if (event.state && event.state.page) {
			if (typeof pages[event.state.page] === "function") {
				pages[event.state.page]();
			} else {
				mountComponent(Page404);
			}
		} else {
			mountComponent(HomeContent);
		}
	};

	document.addEventListener('click', function(event) {
		if (event.target.tagName === 'BUTTON' && event.target.onclick) {
			event.preventDefault();
			const pageNameMatch = event.target.getAttribute('onclick').match(/changePage\('(\w+)'\)/);
			if (pageNameMatch) {
				changePage(pageNameMatch[1]);
			}
		}
	});

	mountComponent(HomeContent);

	return TutorialMenu() + HomeContent();
}

















function Home() {
	let pageHistory = ['home'];
	let currentIndex = 0;

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
			<button onclick="window.homeTutorial.changePage('home')">${window.trans.home}</button>
			<button onclick="window.homeTutorial.changePage('concept')">${window.trans.SPAConcept}</button>
			<button onclick="window.homeTutorial.changePage('navigation')">${window.trans.nav}</button>
			<button onclick="window.homeTutorial.changePage('history')">${window.trans.history}</button>
			<button onclick="window.homeTutorial.changePage('structure')">${window.trans.structure}</button>
			<button onclick="window.homeTutorial.changePage('conclusion')">${window.trans.conclusion}</button>
		</div>
		`;
	}

	function generateContent(pageName) {
		let content = '<div class="container">';
		content += `<h1>${window.trans.SPATutorial}</h1>`;
		content += TutorialMenu();

		switch(pageName) {
			case 'home':
				content += `
					<h2>${window.trans.welcomeSPATutorial}</h2>
					<p>${window.trans.thisTutorial}</p>
					<p>${window.trans.useMenu}</p>
				`;
				break;
			case 'concept':
				content += `
					<h2>${window.trans.whatIsSPA}</h2>
					<p>${window.trans.SPAIs}</p>
					<ul>
						<li>${window.trans.pageRefreshNotNecessary}</li>
						<li>${window.trans.contentIsCollected}</li>
						<li>${window.trans.URLChange}</li>
					</ul>
				`;
				break;
			case 'navigation':
				content += `
					<h2>${window.trans.SPANav}</h2>
					<p>${window.trans.observeContent}</p>
					<p>${window.trans.inSPA}</p>
				`;
				break;
			case 'history':
				content += `
					<h2>${window.trans.historyHandle}</h2>
					<p>${window.trans.historyHandling}</p>
					<p>${window.trans.tryUsing}</p>
				`;
				break;
			case 'structure':
				content += `
					<h2>${window.trans.SPAStructure}</h2>
					<p>${window.trans.ourSPA}</p>
					<ul>
						<li>${window.trans.oneHTML}</li>
						<li>${window.trans.allHTML}</li>
						<li>${window.trans.eachPage}</li>
						<li>${window.trans.backendUses}</li>
						<li>${window.trans.miniLibSPA}</li>
					</ul>
					<h3>${window.trans.keyFunctions}</h3>
					<ul>
						<li><code>changePage(url)</code> : ${window.trans.changePage}</li>
						<li><code>mountComponent(componentFunction, data)</code> : ${window.trans.mountComponent}</li>
						<li><code>bindEvent(state, cssSelector, event, callback)</code> : ${window.trans.bindEvent}</li>
						<li><code>httpGetJson(url)</code> ${window.trans.and} <code>httpPostJson(url, payload)</code> : ${window.trans.httpFunctions}</li>
					</ul>
				`;
				break;
			case 'conclusion':
				content += `
					<h2>${window.trans.conclusion}</h2>
					<p>${window.trans.youBrowsed}</p>
					<ul>
						<li>${window.trans.dynamicLoad}</li>
						<li>${window.trans.navigationWithoutReload}</li>
						<li>${window.trans.navHistory}</li>
					</ul>
					<p>${window.trans.keepOnExploring}</p>
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

	window.homeTutorial = {
		changePage: changePage
	};

	// Initialisation
	return generateContent('home');
}

window.Home = Home;