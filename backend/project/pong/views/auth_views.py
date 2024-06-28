from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm, PasswordChangeForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from pong.forms import RegisterForm







# Cette vue gere l'authentification via l'API d'Intra 42 en redirigeant l'utilisateur vers l'URL d'authentification appropriee
def external_login_view(request):
	forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
	redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id # sauvegarder le client_id dans la session
	response_type = 'code'
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

# Cette vue gere le callback de l'authentification (ie la reponse recue apres que l'utilisateur ait autorise l'application via l'authentification via l'API d'Intra 42)
def auth_callback(request):
	api_response = auth.get_response_from_api(request)
	if api_response is None:
		# print(api_response, "response_code =", api_response.status_code)
		return redirect('/pong/login')    
	elif api_response.status_code == 200:
		token_data = api_response.json()
		access_token = token_data.get('access_token')
		# request.session['access_token'] = access_token # a rajouter pour pour sauvegarder l'access_token dans la session ?
		return auth.get_user_from_api(request, access_token)
	return HttpResponse("Authentication failed", status=401)

# Cette vue gere la connexion des utilisateurs
# - Si la methode HTTP est POST => elle traite le formulaire de connexion
# 	- Si le formulaire est valide => elle authentifie l'utilisateur avec les informations 
#		- Si l'authentification reussit => l'utilisateur est connecte et redirige vers la page d'accueil
#		- Si l'authentification echoue ou si le formulaire n'est pas valide => les erreurs sont affichees pour le debogage
# - Si la methode HTTP n'est pas POST => elle affiche un formulaire de connexion vide
def login_view(request):
	if request.method == 'POST':
		form = AuthenticationForm(request, data=request.POST) #AuthenticationForm = formulaire de Django pour gerer l'authentification 
		if form.is_valid():
			username = form.cleaned_data['username'] # cleaned_data => dictionary of validated form 
			password = form.cleaned_data['password']
			user = authenticate(username=username, password=password) # compare les informations d'identification (nom d'utilisateur et mdp) avec les informations stockees dans la bdd
			if user is not None:
				login(request, user)
				return redirect('/pong/home')  # Redirige vers la page d'accueil après la connexion
			else:
				print("Authentification échouée")
		else:
			print("Formulaire non valide")
			print(form.errors)  # Affiche les erreurs du formulaire pour le debug
		return redirect('/pong/login')
	else:
		form = AuthenticationForm()
	return render(request, 'pong/login.html', {'form': form})

# vue pour gerer la deconnexion de l'utilisateur
@login_required
def logout_view(request):
	logout(request) #fonction de django
	return redirect('/pong/login')



# Cette vue gere l'inscription des nouveaux utilisateurs
# User clique sur bouton pour s'inscrire. GET -> recuperer formulaire d'inscription (RegisterForm())
# User remplit le formulaire et clique sur bouton pour soumettre. POST -> envoyer formulaire d'inscription
# - Si la methode HTTP est POST => on traite le formulaire d'inscription
# 	- Si le formulaire est valide => l'utilisateur est enregistre et connecte automatiquement et l'utilisateur est redirige vers la page de connexion
# 	- Si le formulaire n'est pas valide => les erreurs sont affichees pour le debug
# - Si la methode HTTP n'est pas POST => elle affiche un formulaire d'inscription vide
def register_view(request):
	if request.method == 'POST':
		form = RegisterForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user) 
			print("Enregistrement reussi") 
			return redirect('/pong/login')  
		else:
			print("Formulaire non valide")
			print(form.errors)  
	else:
		form = RegisterForm()
		print("Affichage du formulaire d'inscription") 
	return render(request, 'pong/register.html', {'form': form})