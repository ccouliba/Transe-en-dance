
function Page404() {
	if (logoutState.isLoggedOut){
		return ""
	}
	return `
	<div>
		<h1>${window.trans.err404}</h1>
	</div>`;
}
