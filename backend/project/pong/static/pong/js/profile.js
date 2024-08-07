// declare un objet 'profileState' pour stocker les informations du profil utilisateur
var profileState = {
	username: "", // nom d'utilisateur
	email: "", // email de l'utilisateur
	firstname: "", // prenom de l'utilisateur
	lastname: "", // nom de famille de l'utilisateur
	avatar: "",
	wins: 0,
	losses: 0,
	total_games: 0,
	win_rate: 0,
	isLoaded: false // indique si les donnees du profil ont ete chargees (initialement faux)
}

// loadTranslationScript(function() {
// // fonction pour afficher le profil utilisateur
// function Profile() {
// 	// charge les donnees du profil depuis le backend
// 	loadProfileFromBackend(); // get

// 	// retourne une chaine de caracteres contenant le HTML du composant Profile
// 	return '<div class="container mt-5">'
// 	+ '<h1 class="mb-4">' + gettext('profil') + '</h1>'
// 	+ '<div class="card">'
// 	+ '<div class="card-body">'
// 	+ '<h2 class="mt-4 mb-3" style="text-decoration: underline;">' + gettext('your information') + '</h2>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext("username :") + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.username + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext("email :") + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.email + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext("first name :") + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.firstname + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext("last name :") + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.lastname + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>todo : language :</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.langue + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>avatar :</strong></div>'
// 	+ '<div class="col-sm-9">'
// 	+ '<img src="' + profileState.avatar_url + '" alt="Avatar" style="width: 100px; height: 100px;">'
// 	+ '</div>'
// 	+ '</div>'
// 	+ '<h2 class="mt-4 mb-3" style="text-decoration: underline;">' + gettext('your game statistics') + '</h2>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext('wins :') + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.wins + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext('losses :') + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.losses + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext('total games played :') + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.total_games + '</div>'
// 	+ '</div>'
// 	+ '<div class="row mb-3">'
// 	+ '<div class="col-sm-3"><strong>' + gettext("winning rate :") + '</strong></div>'
// 	+ '<div class="col-sm-9">' + profileState.win_rate.toFixed(2) + '%</div>'
// 	+ '</div>'
// 	+ '</div>'
// 	+ '</div>'
// 	+ '<h2 class="mt-4 mb-3" style="text-decoration: underline;">' + gettext('edit your information') + '</h2>'
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify username') + '</h3>'
// 	+ EditUsername()
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify email') + '</h3>'
// 	+ EditEmail()
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify first name') + '</h3>'
// 	+ EditFirstname()
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify last name') + '</h3>'
// 	+ EditLastname()
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify language') + '</h3>'
// 	+ EditLangue()
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify avatar') + '</h3>'
// 	+ EditAvatar()
// 	+ '<h3 class="mt-4 mb-3">' + gettext('modify password') + '</h3>'
// 	+ EditPassword()
// 	+ '</div>';
// }

//     document.addEventListener('DOMContentLoaded', function() {
//         document.body.innerHTML = Home();
//     });
// });

// fonction pour afficher le profil utilisateur
function Profile() {
	// console.log("translations in Profile: " + translations)
	// console.log("In Profile: " + window.prefLang);
	// charge les donnees du profil depuis le backend
	loadProfileFromBackend(); // get

	const defaultMessage = "plop :";
   
	// Use the fetched welcome message if available, otherwise fall back to the default message
	const username = window.trans?.username || defaultMessage;
	// retourne une chaine de caracteres contenant le HTML du composant Profile
	return `
		<div class="container mt-5">
			<h1 class="mb-4">profil</h1>
			<div class="card">
				<div class="card-body">
				<h2 class="mt-4 mb-3" style="text-decoration: underline;">your information</h2>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>${username}</strong></div>
						<div class="col-sm-9">${profileState.username}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>email :</strong></div>
						<div class="col-sm-9">${profileState.email}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>first name :</strong></div>
						<div class="col-sm-9">${profileState.firstname}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>last name :</strong></div>
						<div class="col-sm-9">${profileState.lastname}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>todo : language :</strong></div>
						<div class="col-sm-9">${profileState.langue}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>avatar :</strong></div>
						<div class="col-sm-9">
							<img src="${profileState.avatar_url}" alt="Avatar" style="width: 100px; height: 100px;">
						</div>
					</div>
					<h2 class="mt-4 mb-3" style="text-decoration: underline;">your game statistics</h2>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>wins :</strong></div>
						<div class="col-sm-9">${profileState.wins}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>losses :</strong></div>
						<div class="col-sm-9">${profileState.losses}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>total games played :</strong></div>
						<div class="col-sm-9">${profileState.total_games}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>winning rate :</strong></div>
						<div class="col-sm-9">${profileState.win_rate.toFixed(2)}%</div>
					</div>
				</div>
			</div>
			<h2 class="mt-4 mb-3" style="text-decoration: underline;">edit your information</h2>

			<h3 class="mt-4 mb-3">modify username</h2>
			${EditUsername()}
			<h3 class="mt-4 mb-3">modify email</h2>
			${EditEmail()}
			<h3 class="mt-4 mb-3">modify first name</h2>
			${EditFirstname()}
			<h3 class="mt-4 mb-3">modify last name</h2>
			${EditLastname()}
			<h3 class="mt-4 mb-3">todo : modify langue</h2>
			${EditLangue()}
			<h3 class="mt-4 mb-3">modify avatar</h2>
			${EditAvatar()}
			<h3 class="mt-4 mb-3">modify password</h2>
			${EditPassword()}
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
	fetch(url, { // envoyer une requete http au backend (vue)
		"credentials": "include" // pour envoyer les cookies au backend car fetch ne le fait pas automatiquement (ex : pour authentification si login required)
	}).then(response => {
		return response.json(); // transformer la reponse en JSON
	}).then(profile => { // promesse
		// mise a jour de profileState avec les donnees recues
		profileState = {
			...profileState,
			...profile,
			total_games: profile.wins + profile.losses,
			win_rate: profile.total_games > 0 ? (profile.wins / profile.total_games) * 100 : 0
		}; // utilisation d'un spread operator
		profileState.isLoaded = true;
		mountComponent(Profile); // monter le composant Profile
		// marquer les donnees du profil comme chargees
	});
}

// fonction pour envoyer les donnees de mise a jour du profil au backend
function sendProfileToBackend(payload) {
	// console.log("authenticated:", !!localStorage.getItem('userToken'));
	let url = `/pong/api/profile/update`; // url de l'API pour mettre a jour le profil

	fetch(url, {
			method: "POST", // methode POST pour envoyer les donnees
			credentials: "include", // envoie les cookies avec la requete = important pour l'authentification
			headers: {
				'Content-Type': 'application/json', // specifie que le contenu envoye est au format JSON
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify(payload) // convertir l'objet payload en chaine JSON
		})
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
			alert('an error occurred while updating the profile. please try again.');
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
		}); // envoyer les donnees au backend
		profileState.isLoaded = false; // marquer les donnees du profil comme non chargees
		mountComponent(Profile); // monter le composant Profile
	});

	return `
		<form id="edit-username" class="mt-3">
			<div class="input-group">
				<input 
					type="text" 
					class="form-control" 
					name="username" 
					value="${profileState.username}" 
				/>
				<button class="btn btn-primary" type="submit">modify</button>
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
		profileState.isLoaded = false; // marquer les donnees du profil comme non chargees
		mountComponent(Profile); // monter le composant Profile
	});
	return `
		<form id="edit-email" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="email" value="${profileState.email}" aria-label="new email">
				<button class="btn btn-primary" type="submit">modifier</button>
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
		profileState.isLoaded = false; // marquer les donnees du profil comme non chargees
		mountComponent(Profile); // monter le composant Profile
	});
	return `
	<form id="edit-first-name" class="mt-3">
		<div class="input-group">
			<input 
				type="text" 
				class="form-control" 
				name="firstname" 
				value="${profileState.firstname}" 
				aria-label="new first name"
			/>
			<button class="btn btn-primary" type="submit">modifier</button>
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
		profileState.isLoaded = false; // marquer les donnees du profil comme non chargees
		mountComponent(Profile); // monter le composant Profile
	});
	return `
	<form id="edit-last-name" class="mt-3">
		<div class="input-group">
			<input 
				type="text" 
				class="form-control" 
				name="lastname" 
				value="${profileState.lastname}" 
				aria-label="new last name"
			/>
			<button class="btn btn-primary" type="submit">modifier</button>
		</div>
	</form>
	`;
}

//todo : juste un modele a modifier
function EditLangue() {
	bindEvent(profileState, "#edit-langue", "submit", event => {
		event.preventDefault();
		const langueInput = event.target.elements.langue.value;

		profileState.langue = langueInput;
		sendProfileToBackend({ 'langue': langueInput });
		profileState.isLoaded = false;
		mountComponent(Profile);
	});
	return `
	<form id="edit-langue" class="mt-3">
		<div class="input-group">
			<input 
				type="text" 
				class="form-control" 
				name="langue" 
				value="${profileState.langue}" 
				aria-label="New langue"
			/>
			<button class="btn btn-primary" type="submit">Modify</button>
		</div>
	</form>
	`;
}
// loadTranslationScript(function() {
//     function EditLangue() {
//         bindEvent(profileState, "#edit-langue", "submit", event => {
//             event.preventDefault();
//             const langueInput = event.target.elements.langue.value;

//             profileState.langue = langueInput;
//             sendProfileToBackend({ 'langue': langueInput });
//             profileState.isLoaded = false;
//             mountComponent(Profile);
//         });

//         return '<form id="edit-langue" class="mt-3">'
// 		+ '<div class="input-group">'
// 		+ '<input '
// 		+ 'type="text" '
// 		+ 'class="form-control" '
// 		+ 'name="langue" '
// 		+ 'value="' + profileState.langue + '" '
// 		+ 'aria-label="' + gettext('New language') + '"'
// 		+ '/>'
// 		+ '<button class="btn btn-primary" type="submit">' + gettext('Modify') + '</button>'
// 		+ '</div>'
// 		+ '</form>';
// 	}

//     // Assuming you want to insert the EditLangue component into the body or a specific element
//     document.getElementById('edit-langue-container').innerHTML = EditLangue();
// });

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
			/>
			<button class="btn btn-primary" type="submit">Upload Avatar</button>
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
		// recupere la valeur du champ 'old_password' du formulaire
		const oldPassword = event.target.elements.old_password.value;
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
					alert('password changed successfully');
					// marque les donnees de profil comme non chargees
					profileState.isLoaded = false;
					// recharge le composant du profil
					mountComponent(Profile);
				} else {
					// prepare un message d'erreur en cas d'echec
					let errorMessage = "there were errors changing your password:\n\n";
					// si l'ancien mot de passe est incorrect
					if (data.errors.old_password) {
						errorMessage += "- your old password was entered incorrectly. please try again.\n";
					}
					// si le nouveau mot de passe ne repond pas aux criteres de securite
					if (data.errors.new_password2) {
						errorMessage += "- please choose a more secure password.\n";
						errorMessage += "\nfor a strong password:\n";
						errorMessage += "- use a mix of uppercase and lowercase letters, numbers, and symbols\n";
						errorMessage += "- avoid using personal information like birthdates or names\n";
						errorMessage += "- make it at least 12 characters long\n";
					}
					// affiche le message d'erreur
					alert(errorMessage);
				}
			})
			// traite les erreurs de la requete
			.catch(error => {
				console.error('error:', error);
				alert('an error occurred. please try again.');
			});
	});

	// retourne le formulaire html pour changer le mot de passe
	return `
	<form id="edit-password-form" class="mt-3">
		<div class="input-group mt-3">
			<input 
				type="password" 
				class="form-control" 
				name="old_password" 
				placeholder="old password" 
				required
			/>
		</div>
		<div class="input-group mt-3">
			<input 
				type="password" 
				class="form-control" 
				name="new_password1" 
				placeholder="new password" 
				required
			/>
		</div>
		<div class="input-group mt-3">
			<input 
				type="password" 
				class="form-control" 
				name="new_password2" 
				placeholder="confirm new password" 
				required
			/>
		</div>
		<button class="btn btn-primary mt-3" type="submit">change password</button>
	</form>
	`;
}
// // Home();
// function loadProfile(language) {
// 	console.log("In loadProfile before: " + prefLang);
// 	// var cookie = getCookie();
// 	// console.log(navigator.language);
// 	prefLang = language;
// 	console.log("In loadProfile after: " + prefLang);
//     loadTranslations(prefLang).then(translations => {
//         document.getElementById('app').innerHTML = Profile(translations);
//     });
// }

// // Call the function to load content
// loadProfile(language);