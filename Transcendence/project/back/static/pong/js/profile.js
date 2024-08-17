// declare un objet 'profileState' pour stocker les informations du profil utilisateur
var profileState = {
	username: "", // nom d'utilisateur
	email: "", // email de l'utilisateur
	firstname: "", // prenom de l'utilisateur
	lastname: "", // nom de famille de l'utilisateur
	langue: localStorage.getItem('selectedLanguage') || 'English',
	avatar_url: "",
	wins: 0,
	losses: 0,
	total_games: 0,
	win_rate: 0,
	has_password: "",
	isLoaded: false // indique si les donnees du profil ont ete chargees (initialement faux)
}

// fonction pour afficher le profil utilisateur
function Profile() {
	if (!profileState.isLoaded) {
		loadProfileFromBackend();
		return '<div>Loading profile...</div>';
	}
	
	 	
	// // charge les donnees du profil depuis le backend
	// loadProfileFromBackend(); // get
	
	let winRate = 0.00
	winRate = profileState.win_rate.toFixed(2)
	bindEvent(profileState, "#deleteAccountBtn", "click", handleDeleteAccount);
	
	let avatarUrl = profileState.avatar_url; 

	// retourne une chaine de caracteres contenant le HTML du composant Profile
	return `
		<div class="container mt-5" id="profilePage">
			<h1 class="mb-4">${window.trans.profile}</h1>
			<div class="card" id="profilePage">
				<div class="card-body">
				<h2 class="mt-4 mb-3" style="text-decoration: underline;">${window.trans.infos}</h2>
				<div class="row mb-3">
						<div class="col-sm-3"><strong>${window.trans.username} :</strong></div>
						<div class="col-sm-9">${profileState.username}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.email} :</strong></div>
					<div class="col-sm-9">${profileState.email}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.firstName} :</strong></div>
					<div class="col-sm-9">${profileState.firstname}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.lastName} :</strong></div>
					<div class="col-sm-9">${profileState.lastname}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.language} :</strong></div>
					<div class="col-sm-9">${profileState.langue}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.avatar} :</strong></div>
						<div class="col-sm-9">
							<img src="${avatarUrl}" alt="Avatar" style="width: 100px; height: 100px;">
						</div>
				</div>
				<h2 class="mt-4 mb-3" style="text-decoration: underline;">${window.trans.gameStats}</h2>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.wins} :</strong></div>
					<div class="col-sm-9">${profileState.wins}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.losses} :</strong></div>
					<div class="col-sm-9">${profileState.losses}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.totalGamesPlayed} :</strong></div>
					<div class="col-sm-9">${profileState.total_games}</div>
				</div>
				<div class="row mb-3">
					<div class="col-sm-3"><strong>${window.trans.winRate} :</strong></div>
					<div class="col-sm-9">${winRate}%</div>
				</div>
			</div>
		</div>

		<div class="accordion" id="accordionExample">
			<div class="accordion-item">
				<h2 class="accordion-header" id="headingTwo">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
						${window.trans.editInfos}
					</button>
				</h2>
			<div id="collapseTwo" class="" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
				<div class="accordion-body">
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._username}</h2>
					${EditUsername()}
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._email}</h2>
					${EditEmail()}
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._firstName}</h2>
					${EditFirstname()}
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._lastName}</h2>
					${EditLastname()}
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._language}</h2>
					${EditLangue()}
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._avatar}</h2>
					${EditAvatar()}
					<h3 class="mt-4 mb-3">${window.trans.modify} ${window.trans._password}</h2>
					${EditPassword()}
					${DownloadUserInfo()}
					<div class="mt-4">
						<button id="deleteAccountBtn" class="btn btn-danger">${window.trans.delete} ${window.trans._account}</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

// fonction pour charger les donnees du profil depuis le backend
async function loadProfileFromBackend() {

	// verifier si les donnees du profil sont deja chargees
	if (profileState.isLoaded) { // pour eviter des fetch infinis au backend
		return;
	}

	let url = `/pong/api/profile`; // url de l'API pour recuperer les donnees du profil
	httpGetJson(url)// envoyer une requete http au backend (vue)
		.then(profile => { // promesse
			// mise a jour de profileState avec les donnees recues
			profileState = {
				...profileState,
				...profile,
				win_rate: profile.win_rate
				// total_games: profile.wins + profile.losses,
				// win_rate: profile.total_games > 0 ? (profile.wins / profile.total_games) * 100 : 0
			}; // utilisation d'un spread operator
			// console.log(profile)
			profileState.isLoaded = true;
			mountComponent(Profile); // monter le composant Profile
			// marquer les donnees du profil comme chargees
		});
}

// fonction pour envoyer les donnees de mise a jour du profil au backend
function sendProfileToBackend(payload) {
	// console.log("authenticated:", !!localStorage.getItem('userToken'));
	let url = `/pong/api/profile/update`; // url de l'API pour mettre a jour le profil

	return httpPostJson(url, payload)
		.then(response => {
			if (!response.ok) {
				return response.text().then(text => {
					throw new Error(`http error! status: ${response.status}, message: ${text}`);
				});
			}
			return response.json(); // transformer la reponse en JSON
		})
		.then(data => console.log('success:', data))
		.catch(error => {
			console.error('error:', error);
			alert('Please ensure that the information you provide is accurate and correct.');
		});
}

// fonction pour modifier le nom d'utilisateur
function EditUsername() {
	// ceci ne fonctionnerait pas :
	// document.querySelector("#edit-username").addEventListener("submit", event => { ... })
	// on utilise bindEvent a la place de addEventListener
	bindEvent(profileState, "#edit-username", "submit", event => {
		event.preventDefault(); // empecher l'execution par defaut de l'evenement submit
		const usernameInput = event.target.elements.username.value; // recuperer la nouvelle valeur du nom d'utilisateur

		profileState.username = usernameInput; // mettre a jour profileState
		sendProfileToBackend({
			'username': usernameInput
		}).then(() => {
			profileState.isLoaded = false
			mountComponent(Profile);
		})
		 // monter le composant Profile
		 // marquer les donnees du profil comme non chargees
	});

	return `
		<form id="edit-username" class="mt-3">
			<div class="form-floating w-50">
				<input 
					type="text" 
					class="form-control"
					id="username" 
					name="username"
					placeholder="${window.trans.modify} ${window.trans._username}" 
					value="${profileState.username}"
					aria-label="new username"
				/>
				<label for="username" class="form-label">${window.trans.modify} ${window.trans._username}</label>
				<button class="btn btn-secondary" type="submit">${window.trans.modify}</button>
			</div>
		</form> 	
	`;
}

// fonction pour modifier l'email
function EditEmail() {
	bindEvent(profileState, "#edit-email", "submit", event => {
		event.preventDefault(); // empecher l'execution par defaut de l'evenement submit
		const emailInput = event.target.elements.email.value; // recuperer la nouvelle valeur de l'email

		profileState.email = emailInput; // mettre a jour profileState
		sendProfileToBackend({
			'email': emailInput
		}); // envoyer les donnees au backend
		profileState.isLoaded = false;
		mountComponent(Profile); // monter le composant Profile
		 // marquer les donnees du profil comme non chargees
	});
	return `
		<form id="edit-email" class="mt-3">
			<div class="form-floating w-50">
				<input
					type="text"
					class="form-control"
					id="email"
					name="email"
					placeholder="${window.trans.modify} ${window.trans._email}"
					value="${profileState.email}"
					aria-label="new email"
				/>
				<label for="email" class="form-label">${window.trans.modify} ${window.trans._email}</label>
				<button class="btn btn-secondary" type="submit">${window.trans.modify}</button>
			</div>
		</form>
	`;
}

// fonction pour modifier le prenom
function EditFirstname() {
	bindEvent(profileState, "#edit-first-name", "submit", event => {
		event.preventDefault(); // empecher l'execution par defaut de l'evenement submit
		const firstnameInput = event.target.elements.firstname.value; // recuperer la nouvelle valeur du prenom

		profileState.firstname = firstnameInput; // mettre a jour profileState
		sendProfileToBackend({
			'firstname': firstnameInput
		}); // envoyer les donnees au backend
		profileState.isLoaded = false;
		mountComponent(Profile); // monter le composant Profile
		 // marquer les donnees du profil comme non chargees
	});
	return `
	<form id="edit-first-name" class="mt-3">
		<div class="form-floating w-50">
			<input 
				type="text" 
				class="form-control" 
				name="firstname" 
				id="firstname"
				placeholder="${window.trans.modify} ${window.trans._firstName}"
				value="${profileState.firstname}" 
				aria-label="new first name"
			/>
			<label for="firstname" class="form-label">${window.trans.modify} ${window.trans._firstName}</label>
			<button class="btn btn-secondary" type="submit">${window.trans.modify}</button>
		</div>
	</form>
	`;
}

// fonction pour modifier le nom de famille
function EditLastname() {
	bindEvent(profileState, "#edit-last-name", "submit", event => {
		event.preventDefault(); // empecher l'execution par defaut de l'evenement submit
		const lastnameInput = event.target.elements.lastname.value; // recuperer la nouvelle valeur du nom de famille

		profileState.lastname = lastnameInput; // mettre a jour profileState
		sendProfileToBackend({
			'lastname': lastnameInput
		}); // envoyer les donnees au backend
		profileState.isLoaded = false;
		mountComponent(Profile); // monter le composant Profile
		 // marquer les donnees du profil comme non chargees
	});
	return `
	<form id="edit-last-name" class="mt-3">
		<div class="form-floating">
			<input 
				type="text" 
				class="form-control" 
				name="lastname"
				id="lastname"
				placeholder="${window.trans.modify} ${window.trans._lastName}"
				value="${profileState.lastname}" 
				aria-label="new last name"
			/>
			<label for="lastname" class="form-label">${window.trans.modify} ${window.trans._lastName}</label>
			<button class="btn btn-secondary" type="submit">${window.trans.modify}</button>
		</div>
	</form>
	`;
}

function EditLangue() {
	bindEvent(profileState, "#edit-langue", "submit", event => {
		event.preventDefault();
		const langueInput = event.target.elements.languageSelector.value;

		profileState.langue = langueInput;
		localStorage.setItem('selectedLanguage', langueInput);
		sendProfileToBackend({ 'langue': langueInput });
		mountComponent(Profile);
		profileState.isLoaded = false;
		changeLanguage();
	});
	return `
	<form id="edit-langue">
	<select class="form-select" name="languageSelector" id="languageSelector" aria-label="Select your language">
		<option value="English" id="langue" name="langue">English 🇺🇸</option>
		<option value="Français" id="langue" name="langue">Français 🇫🇷</option>
		<option value="Español" id="langue" name="langue">Español 🇪🇸</option>
	</select>
	<button class="btn btn-secondary" type="submit">${window.trans.modify}</button>
	</form>
	`;
}

//   <option value="it" id="italianOption">Italiano 🇮🇹</option>

function EditAvatar() {
	bindEvent(profileState, "#edit-avatar", "submit", event => {
		event.preventDefault();
		const avatarInput = event.target.elements.avatar;
		
		if (avatarInput.files && avatarInput.files[0]) {
			const formData = new FormData();
			formData.append('avatar', avatarInput.files[0]);
			fetch('/pong/api/profile/upload-avatar/', { 
				method: 'POST', 
				body: formData,
				credentials: 'include',
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					profileState.avatar = data.avatar_url;
					profileState.isLoaded = false;
					mountComponent(Profile);
				} else {
					alert('Error uploading avatar: ' + JSON.stringify(data.errors));
				}
			})
			.catch(error => {
				console.error('Error:', error);
				alert('An error occurred while uploading the avatar. Please try again.');
			});
		}
	});

	return `
	<form id="edit-avatar" class="mt-3">
		<div class="input-group">
			<input 
				type="file" 
				class="form-control" 
				name="avatar" 
				accept="image/*"
				aria-label="new avatar"
			/>
			<button class="btn btn-secondary" type="submit">${window.trans.upload} ${window.trans._avatar}</button>
		</div>
	</form>
	`;
}

// fonction pour modifier le mot de passe
function EditPassword() {
	// attache un evenement submit au formulaire avec l'id => edit-password-form
	bindEvent(profileState, "#edit-password-form", "submit", event => {
		// empeche le comportement par defaut du formulaire ie soumission et rechargement de la page
		event.preventDefault();

		let  oldPassword = ""
		
		if (profileState.has_password){
			oldPassword = event.target.elements.old_password.value;
		}
		
		// recupere la valeur du champ 'new_password1' du formulaire
		const newPassword1 = event.target.elements.new_password1.value;
		// recupere la valeur du champ 'new_password2' du formulaire
		const newPassword2 = event.target.elements.new_password2.value;

		let url = `/pong/api/profile/change-password`;

		// envoie une requete POST a l'API pour changer le mot de passe
		httpPostJson(url, {
			old_password: oldPassword,
			new_password1: newPassword1,
			new_password2: newPassword2
		})
			.then(response => response.json())
			// traite les donnees recues de l'API
			.then(data => {
				// si le changement de mot de passe est reussi
				if (data.status === 'success') {
					alert(`${window.trans.successPasswordChange}`);
					// marque les donnees de profil comme non chargees
					// recharge le composant du profil
					mountComponent(Profile);
					profileState.isLoaded = false;
				} else {
					// prepare un message d'erreur en cas d'echec
					let errorMessage = `${window.trans.errPasswordChange}:\n\n`;
					// si l'ancien mot de passe est incorrect
					if (data.errors.old_password) {
						errorMessage += `${window.trans.errOldPasswordRetry}\n`;
					}
					// si le nouveau mot de passe ne repond pas aux criteres de securite
					if (data.errors.new_password2) {
						errorMessage += `${window.trans.chooseMoreSecurePassword}\n`;
						errorMessage += `\n${window.trans.forStrongPassword}\n`;
						errorMessage += `- ${window.trans.useMixOfSymbols}\n`;
						errorMessage += `- ${window.trans.avoidPersonalInfo}\n`;
						errorMessage += `- ${window.trans.minimumLengthPassword}\n`;
					}
					// affiche le message d'erreur
					alert(errorMessage);
				}
			})
			// traite les erreurs de la requete
			.catch(error => {
				console.error(`${window.trans.error}:`, error);
				alert(`${window.trans.errorRetry}`);
			});
	});

	// retourne le formulaire html pour changer le mot de passe
	return `
	<form id="edit-password-form" class="mt-3">
	${profileState.has_password ? `
		<div class="form-floating mt-3 w-50">
			<input 
				type="password" 
				class="form-control" 
				name="old_password" 
				id="old_password" 
				placeholder="${window.trans.oldPassword}" 
				required
			/>
			<label for="old_password" class="form-label">${window.trans.oldPassword}</label>
		</div>
		` : ''}
		<div class="form-floating mt-3 w-50">
			<input 
				type="password" 
				class="form-control"
				id="new_password1" 
				name="new_password1" 
				placeholder="${window.trans.newPassword}"
				required
			/>
			<label for="new_password1" class="form-label">${window.trans.newPassword}</label>
		</div>
		<div class="form-floating mt-3 w-50">
			<input 
				type="password" 
				class="form-control"
				id="new_password2"  
				name="new_password2" 
				placeholder="${window.trans.confirmNewPassword}" 
				required
			/>
			<label for="new_password2" class="form-label">${window.trans.confirmNewPassword}</label>
		</div>
		<button class="btn btn-secondary mt-3" type="submit">${window.trans.change} ${window.trans._password}</button>
	</form>
	`;
}


function handleDeleteAccount() {
	if (confirm(`${window.trans.confirmDelAcc}`)) {
		fetch('/pong/api/profile/soft_delete_user/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken') 
			},
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				alert(`${window.trans.accDeleted}.`);
				// changePage(Login);
				changePage("#login");
			} else {
				alert(`${window.trans.errDeletingAccRetry}`);
			}
		})
		.catch(error => {
			console.error(`${window.trans.error}`, error);
			alert(`${window.trans.errDeletingAccRetry}`);
		});
	}
}

function DownloadUserInfo() {
	bindEvent(profileState, "#download-user-info", "click", event => {
		event.preventDefault();
		const url = 'get_user_info?format=pdf';
		
		fetch(url, {
			method: 'GET',
			credentials: 'include',
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.blob();
		})
		.then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = 'user_info.pdf';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		})
		.catch(error => {
			console.error('Error:', error);
		});
	});

	return `
	<div class="mt-3">
		<button id="download-user-info" class="btn btn-primary">${window.trans.downloadUserInfo}</button>
	</div>
	`;
}