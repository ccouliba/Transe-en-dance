function PrivacyPolicy() {
	return `
		<div class="container mt-5" id="profilePage">
			<h1>${window.trans.privacyPolicy}</h1>

			<h2>${window.trans.introduction}</h2>
			<p>${window.trans.welcomePP}.</p>

			<h2>${window.trans.informationCollect}</h2>
			<p>${window.trans.weCollect}:</p>
			<ul>
				<li>${window.trans.personalInfos}</li>
				<li>${window.trans.gameRelatedData}</li>
			</ul>

			<h2>${window.trans.howWeUseInfos}</h2>
			<p>${window.trans.weUseInfos}:</p>
			<ul>
				<li>${window.trans.improving}</li>
				<li>${window.trans.managing}</li>
			</ul>

			<h2>${window.trans.yourRights}</h2>
			<p>${window.trans.youHaveTheRight}.</p>

			<h2>${window.trans.contactUs}</h2>
			<p>${window.trans.haveQuestions}</p>
		</div>
	`;
}