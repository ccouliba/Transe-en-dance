from io import BytesIO
import json
from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.validators import validate_email
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import UserChangeForm, PasswordChangeForm
from django.contrib.auth.decorators import login_required
from django.utils import translation
from django.utils.translation import gettext as _
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from back.models import User, Friendship, Game
from back.forms import AvatarUploadForm
from django.core.exceptions import ValidationError
from django.utils.html import escape
from .. import forms
from django.db.models import Q, Count, Sum, Case, When, IntegerField


@login_required
def get_user_locale(request):
    
    
    lang = request.user.langue
    
    return JsonResponse({"lang": lang})

# This view for multilang
@login_required
def change_language(request):

	#user = request.user

	if request.method == 'POST':
		form = forms.SetLanguageForm(request.POST)
		if form.is_valid():
			
			user_language = form.cleaned_data['language']
			#user.lang  = user_language
			#user.save()
			translation.activate(user_language)
			response = redirect('/pong/home')
			response.set_cookie(settings.LANGUAGE_COOKIE_NAME, user_language)
			return response
	else:
		form = forms.SetLanguageForm()
	return render(request, 'pong/change_language.html', {'form': form})

@login_required
@require_POST
def	profile_update_view(request):
		data = json.loads(request.body)
		user = request.user
		updated = []
		if 'username' in data:
			user.username = escape(data['username'])
			updated.append('username')

		if 'email' in data:
			user.email = escape(data['email'])
			try:
				validate_email(user.email )
			except ValidationError:
				return JsonResponse({'status': 'failed', 'message': "email format invalid"}, status=400)
			updated.append('email')

		if 'firstname' in data:
			user.first_name = escape(data['firstname'])
			updated.append('firstname')

		if 'lastname' in data:
			user.last_name = escape(data['lastname'])
			updated.append('lastname')
		
		if 'langue' in data:
			user.langue = escape(data['langue'])
			updated.append('langue')
		
		if 'avatar' in data:
			user.last_name = escape(data['avatar'])
			updated.append('avatar')

		if updated:
			user.save()
			return JsonResponse({'status': 'success', 'updated': updated})
		else:
			return JsonResponse({'status': 'error', 'message': 'No valid fields to update'}, status=400)

#Cette vue affiche le profil de l'utilisateur connecte en rendant la page HTML appropriee
@login_required
def profile_view(request):
	user = request.user
	
	# Calculer les statistiques pour tous les jeux (1v1 et tournoi)
	game_stats = Game.objects.filter(Q(player1=user) | Q(player2=user)).aggregate(
		total_games=Count('id'),
		wins=Count(Case(When(winner=user, then=1))),
		total_score=Sum(Case(
			When(player1=user, then='player1_score'),
			When(player2=user, then='player2_score'),
			default=0,
			output_field=IntegerField()
		))
	)

	wins = game_stats['wins']
	total_games = game_stats['total_games']
	losses = total_games - wins
	win_rate = (wins / total_games * 100) if total_games > 0 else 0

	profile_data = {
		'username': user.username,
		'email': user.email,
		'firstname': user.first_name,
		'lastname': user.last_name,
		'avatar_url': user.get_avatar_url(),
		'wins': wins,
		'losses': losses,
		'total_games': total_games,
		'langue': user.langue,
		'win_rate': win_rate,
		'total_score': game_stats['total_score'],
		'has_password': bool(user.password) 
	}

	return JsonResponse(profile_data)


#Cette vue permet a l'utilisateur connecte de mettre a jour son profil en utilisant un formulaire fourni par Django
@login_required
def user_updated_profile(request):
	if request.method == 'POST':
		form = UserChangeForm(request.POST, instance=request.user) # CECI EST DE LA MAGIE : formulaire fourni par django
		if form.is_valid():
			form.save()
			return redirect('/pong/profile')  
			# return redirect('pong/profile.html')  
	else:
		form = UserChangeForm(instance=request.user)
	return render(request, 'pong/update.html', {'form': form})

# Cette vue permet a l'utilisateur connecte de changer son mot de passe en utilisant un formulaire fourni par Django





@login_required
@require_POST
def edit_password_view(request):
	print(f"User authenticated: {request.user.is_authenticated}")
	print(f"Username: {request.user.username}")
		# tente de charger les donnees JSON du corps de la requete
	data = json.loads(request.body)
	user = request.user
	if not user.password: #pour api42 utilise set_password
		if data.get('new_password1') != data.get('new_password2'):
				return JsonResponse(
				{'status': 'error', 'errors': {'new_password2': ['The two password fields didn\'t match.']}},
				status=200
			)
		user.set_password(data.get('new_password1'))
		user.save()
		update_session_auth_hash(request, user)
		return JsonResponse({'status': 'success'})

	form = PasswordChangeForm(user=user, data={
		'old_password': data.get('old_password'),
		'new_password1': data.get('new_password1'),
		'new_password2': data.get('new_password2')
	})

	if form.is_valid():
		# Si le formulaire est valide => enregistre le nouveau mot de passe
		form.save()
		# Mise a jour de la session d'authentification de l'utilisateur pour eviter la deconnexion
		update_session_auth_hash(request, form.user) #methode Django
		return JsonResponse({'status': 'success'})

	return JsonResponse({'status': 'error', 'errors': form.errors}, status=200)



@login_required
@require_POST
@csrf_exempt
def upload_avatar(request):
	form = AvatarUploadForm(request.POST, request.FILES, instance=request.user)
	if form.is_valid():
		form.save()
		return JsonResponse({'status': 'success', 'avatar_url': request.user.get_avatar_url()})  
	return JsonResponse({'status': 'error', 'errors': form.errors}, status=200)


# RGPD stuff 

# cette vue permet a un utilisateur de telecharger ses donnees en pdf 
@login_required
def get_user_info(request):
	user = request.user
	user_info = {
		'username': user.username,
		'email': user.email,
		'first_name': user.first_name,
		'last_name': user.last_name,
		'creation_date': user.creation_date,
		'friends': list(user.friends.values('id', 'username', 'email')),
	}

	# Si le paramètre `format` est 'pdf', générer et retourner un PDF
	if request.GET.get('format') == 'pdf':
		# Créer un buffer pour le PDF
		buffer = BytesIO()
		# Créer un canevas pour le PDF
		p = canvas.Canvas(buffer, pagesize=letter)
		# Définir les coordonnées de départ pour le texte
		start_y = 750
		line_height = 15

		# Ajouter les informations utilisateur au PDF
		p.drawString(100, start_y - line_height, f"Username: {user_info['username']}")
		p.drawString(100, start_y - 2 * line_height, f"Email: {user_info['email']}")
		p.drawString(100, start_y - 3 * line_height, f"First Name: {user_info['first_name']}")
		p.drawString(100, start_y - 4 * line_height, f"Last Name: {user_info['last_name']}")
		p.drawString(100, start_y - 5 * line_height, f"Creation Date: {user_info['creation_date']}")

		# Ajouter les amis
		p.drawString(100, start_y - 9 * line_height, "Friends:")
		for i, friend in enumerate(user_info['friends']):
			p.drawString(120, start_y - (10 + i) * line_height, f"{friend['username']} ({friend['email']})")

		# Finaliser le PDF
		p.showPage()
		p.save()

		# Revenir au début du buffer
		buffer.seek(0)

		# Retourner le PDF en réponse HTTP
		return HttpResponse(buffer, content_type='application/pdf')

	# Si le format n'est pas PDF, retourner les informations en JSON
	return JsonResponse(user_info, safe=False)
