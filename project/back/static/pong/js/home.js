function Home() {

	if (logoutState.isLoggedOut){
		return ""
	}
	return `
	<h2>${window.trans.welcome}</h2>

`;
}