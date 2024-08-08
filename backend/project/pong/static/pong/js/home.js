function Home() {
	// Need to use a tmp_trans to call loadTranslations only one at the beginning to avoid calling Home at the end of the file
	// Can't use window.trans cause if I do, translations remain in english
	if (window.tmp_trans == null)
		loadTranslations(window.tmp_trans);

	// Necessary cause the first translations don't load fast enough when first showing home page
		const defaultMessage = "Welcome Home";
		const welcomeMessage = window.trans?.welcome || defaultMessage;

		return `
		<div>
			<h1>${welcomeMessage}</h1>
		</div>
		<button class="btn btn-primary mb-3" onclick="changeLanguage('es')">Spanish</button>
		<button class="btn btn-primary mb-3" onclick="changeLanguage('en')">English</button>
		<button class="btn btn-primary mb-3" onclick="changeLanguage('fr')">French</button>`
		;
}
