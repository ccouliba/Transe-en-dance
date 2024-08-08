function ChooseLanguage() {
	// Lie un evenement de changement a l'element avec l'ID "#chooseLanguage"
	bindEvent(profileState, "#chooseLanguage", "change", e => changeLanguage(e.target.value));

	// langues disponibles 
	const availableLanguages = [
		{ code: 'fr', name: 'Français' },
		{ code: 'en', name: 'English' },
	];
	// Obtient la langue actuelle
	const currentLang = getCurrentLanguage();
	
	// Cree les options pour le select (liste deroulante)
	const options = availableLanguages.map(lang => 
		`<option value="${lang.code}" ${lang.code === currentLang ? 'selected' : ''}>${lang.name}</option>`
	).join('');
	
	// Retourne le HTML pour le selecteur de langue
	return `
		<select id="chooseLanguage">
			${options}
		</select>
	`;
}