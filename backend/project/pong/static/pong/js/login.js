let loginState = {
	isLoaded: false,
	showRegister: false
};

function Login() {
	if (!loginState.isLoaded) {
		loadLoginState();
	}

	return `
		${Menu()}
		<div class="container mt-5">
			<h1>${loginState.showRegister ? 'Register' : 'Login'}</h1>
			${loginState.showRegister ? RegisterForm() : LoginForm()}
			<p class="mt-3">
				${loginState.showRegister 
					? 'Already have an account? <a href="#" id="showLogin">Login</a>' 
					: 'Don\'t have an account? <a href="#" id="showRegister">Register</a>'}
			</p>
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
			<div class="mb-3">
				<input type="text" class="form-control" name="username" placeholder="Username" required>
			</div>
			<div class="mb-3">
				<input type="password" class="form-control" name="password" placeholder="Password" required>
			</div>
			<button type="submit" class="btn btn-primary">Login</button>
		</form>
	`;
}

function RegisterForm() {
	return `
		<form id="registerForm">
			<div class="mb-3">
				<input type="text" class="form-control" name="username" placeholder="Username" required>
			</div>
			<div class="mb-3">
				<input type="email" class="form-control" name="email" placeholder="Email" required>
			</div>
			<div class="mb-3">
				<input type="password" class="form-control" name="password1" placeholder="Password" required>
			</div>
			<div class="mb-3">
				<input type="password" class="form-control" name="password2" placeholder="Confirm Password" required>
			</div>
			<button type="submit" class="btn btn-primary">Register</button>
		</form>
	`;
}

function handleLogin(event) {
	event.preventDefault();
	const username = event.target.elements.username.value;
	const password = event.target.elements.password.value;
	let url = `/pong/api/login/`;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
		body: JSON.stringify({ username, password }),
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
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
	let url = `/pong/api/register`;

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
			changePage('#profile');
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
