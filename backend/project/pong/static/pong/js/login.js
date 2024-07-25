let loginState = {
	isLoaded: false,
	showRegister: false
};

function Login() {
	if (!loginState.isLoaded) {
		loadLoginState();
	}

	return `
		<div class="container mt-5">
			<h1>${loginState.showRegister ? 'Register' : 'Login'}</h1>
			${loginState.showRegister ? RegisterForm() : LoginForm()}
			<p class="mt-3">
				${loginState.showRegister 
					? 'Already have an account? <a href="#" id="showLogin">Login</a>' 
					: 'Don\'t have an account? <a href="#" id="showRegister">Register</a>'}
			</p>
			${!loginState.showRegister ? '<a href="/pong/external_login/" class="btn btn-secondary">Login with 42</a>' : ''}
		</div>
	`;
}

function ExternalLoginButton() {
	return `
		<div class="mt-3">
			<a href="/pong/external_login/" class="btn btn-secondary">Login with 42</a>
		</div>
	`;
}

function loadLoginState() {
	bindEvent(loginState, "#loginForm", "submit", handleLogin);
	bindEvent(loginState, "#registerForm", "submit", handleRegister);
	bindEvent(loginState, "#showRegister", "click", toggleRegister);
	bindEvent(loginState, "#showLogin", "click", toggleRegister);
	loginState.isLoaded = true;
}

function LoginForm() {
	return `
		<form id="loginForm">
			<div class="form-floating">
				<input type="text" class="form-control" name="username" id="username" placeholder="Username" required>
				<label for="username">Username</label>
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password" id="password" placeholder="Password" required>
				<label for="password">Password</label>
			</div>
			<button type="submit" class="btn custom-btn" style="background-color: green">Login</button>
		</form>
	`;
}


function RegisterForm() {
	return `
		<form id="registerForm">
			<div class="form-floating">
				<input type="text" class="form-control" name="username" id="username" placeholder="Username" required>
				<label for="username">Username</label>
			</div>
			<div class="form-floating">
				<input type="email" class="form-control" name="email" id="email" placeholder="Email" required>
				<label for="email">Email</label>
			</div>
			<div id="passwordHelpBlock" class="form-text">
				Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password1" id="password1" placeholder="Password" required>
				<label for="password1">Password</label>
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password2" id="password2" placeholder="Confirm Password" required>
				<label for="password2">Confirm password</label>
			</div>
			<button type="submit" class="btn btn-primary">Register</button>
		</form>
	`;
}

function handleLogin(event) {
	event.preventDefault();
	const username = event.target.elements.username.value;
	const password = event.target.elements.password.value;
	const csrfToken = getCookie('csrftoken');
   
	console.log('CSRF Token:', csrfToken); 
	let url = `/pong/api/login/`;
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		},
		body: JSON.stringify({ username, password }),
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok) throw new Error('Network response was not ok');
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			localStorage.setItem('userToken', 'true');
			console.log("Token set:", localStorage.getItem('userToken'));
			alert('Login successful!');
			changePage('#profile');
		} else {
			alert('Login failed: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred during login. Please try again.');
	});
}

function handleRegister(event) {
	event.preventDefault();
	const username = event.target.elements.username.value;
	const email = event.target.elements.email.value;
	const password1 = event.target.elements.password1.value;
	const password2 = event.target.elements.password2.value;
	let url = `/pong/api/register/`;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
		body: JSON.stringify({ username, email, password1, password2 }),
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert('Registration successful!');
			changePage('#home');
		} else {
			alert('Registration failed: ' + JSON.stringify(data.message));
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred during registration. Please try again.');
	});
}

function toggleRegister(event) {
	event.preventDefault();
	loginState.showRegister = !loginState.showRegister;
	mountComponent(Login);
}
