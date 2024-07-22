from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.forms import UserChangeForm, PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from io import BytesIO
from django.utils import translation
from django.utils.translation import gettext as _
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from pong.models import User, Friendship
from .. import forms
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json

# This view for multilang
@login_required
def change_language(request):
    if request.method == 'POST':
        form = forms.SetLanguageForm(request.POST)
        if form.is_valid():
            user_language = form.cleaned_data['language']
            translation.activate(user_language)
            response = redirect('/pong/home')
            response.set_cookie(settings.LANGUAGE_COOKIE_NAME, user_language)
            return response
    else:
        form = forms.SetLanguageForm()
    return render(request, 'pong/change_language.html', {'form': form})

# path('pong/api/profile/update', profile_update_view, name='profile_update'),
@login_required
@csrf_exempt
@require_POST
def	profile_update_view(request):
		data = json.loads(request.body)
		user = request.user
		updated = []

		if 'username' in data:
			user.username = data['username']
			updated.append('username')

		if 'email' in data:
			user.email = data['email']
			updated.append('email')

		if 'firstname' in data:
			user.first_name = data['firstname']
			updated.append('firstname')

		if 'lastname' in data:
			user.last_name = data['lastname']
			updated.append('lastname')

		if updated:
			user.save()
			return JsonResponse({'status': 'success', 'updated': updated})
		else:
			return JsonResponse({'status': 'error', 'message': 'No valid fields to update'}, status=400)

	# new_username = json.loads(request.body).get('username')
	# if new_username is not None:
	# 	request.user.username = new_username
	# 	request.user.save()
	# 	return JsonResponse({'status': 'success'})
	

#Cette vue affiche le profil de l'utilisateur connecte en rendant la page HTML appropriee
@login_required
def profile_view(request):
	user = request.user
	friends = user.friends.all()
	sent_requests = Friendship.objects.filter(id_user_1=user)
	received_requests = Friendship.objects.filter(id_user_2=user)
 
	return JsonResponse({
		'username': user.username,
		'email': user.email,
		'firstname': user.first_name,
		'lastname' : user.last_name,
		'id' :user.id
  
  
	})
 
	# return render(request, 'pong/profile.html', {
	# 	'user': user,
	# 	'friends': friends,
	# 	'sent_requests': sent_requests,
	# 	'received_requests': received_requests
	# })

# @login_required
# def profile_view(request):
# 	return render(request, 'pong/profile.html')

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
# @csrf_exempt  #todo
@require_POST
def edit_password_view(request):
	print(f"User authenticated: {request.user.is_authenticated}")
	print(f"Username: {request.user.username}")
	try:
		# tente de charger les donnees JSON du corps de la requete
		data = json.loads(request.body)
		# creer un formulaire de changement de mot de passe avec les donnees de l'utilisateur
		form = PasswordChangeForm(user=request.user, data={
			'old_password': data.get('old_password'),
			'new_password1': data.get('new_password1'),
			'new_password2': data.get('new_password2')
		})
		# verifie si le formulaire est valide
		if form.is_valid():
			# Si le formulaire est valide => enregistre le nouveau mot de passe
			form.save()
			# Mise a jour de la session d'authentification de l'utilisateur pour eviter la deconnexion
			update_session_auth_hash(request, form.user) #methode Django
			return JsonResponse({'status': 'success'})
		else:
			# Si le formulaire n'est pas valide :
			return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
	except json.JSONDecodeError:
		# Si une erreur de decodage JSON se produit :
		return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
	except Exception as e:
		# Si une autre erreur se produit :
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# Can be changed any time ! Just a simple view linked to a template/form that works
# Cette vue permet a l'utilisateur connecte de supprimer son compte et de rediriger vers la page d'accueil
@login_required
def user_account_deleted(request):
	user = request.user
	user.delete()
	return redirect('pong/home.html')  


# RGPD stuff 

# cette vue permet a un utilisateur de telecharger ses donnees en pdf 
@login_required
def get_user_info(request):
	user = request.user
	user_info = {
		'id': user.id,
		'username': user.username,
		'email': user.email,
		'first_name': user.first_name,
		'last_name': user.last_name,
		'creation_date': user.creation_date,
		'langue': user.langue,
		'avatar': user.avatar,
		'friends': list(user.friends.values('id', 'username', 'email')),
		'groups': list(user.groups.values('id', 'name')),
		'user_permissions': list(user.user_permissions.values('id', 'name', 'codename')),
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
		p.drawString(100, start_y, f"ID: {user_info['id']}")
		p.drawString(100, start_y - line_height, f"Username: {user_info['username']}")
		p.drawString(100, start_y - 2 * line_height, f"Email: {user_info['email']}")
		p.drawString(100, start_y - 3 * line_height, f"First Name: {user_info['first_name']}")
		p.drawString(100, start_y - 4 * line_height, f"Last Name: {user_info['last_name']}")
		p.drawString(100, start_y - 5 * line_height, f"Creation Date: {user_info['creation_date']}")
		p.drawString(100, start_y - 6 * line_height, f"Langue: {user_info['langue']}")
		p.drawString(100, start_y - 7 * line_height, f"Avatar: {user_info['avatar']}")

		# Ajouter les amis
		p.drawString(100, start_y - 9 * line_height, "Friends:")
		for i, friend in enumerate(user_info['friends']):
			p.drawString(120, start_y - (10 + i) * line_height, f"{friend['username']} ({friend['email']})")

		# Ajouter les groupes
		p.drawString(100, start_y - (11 + len(user_info['friends'])) * line_height, "Groups:")
		for i, group in enumerate(user_info['groups']):
			p.drawString(120, start_y - (12 + len(user_info['friends']) + i) * line_height, f"{group['name']}")

		# Ajouter les permissions
		p.drawString(100, start_y - (13 + len(user_info['friends']) + len(user_info['groups'])) * line_height, "Permissions:")
		for i, permission in enumerate(user_info['user_permissions']):
			p.drawString(120, start_y - (14 + len(user_info['friends']) + len(user_info['groups']) + i) * line_height, f"{permission['name']}")

		# Finaliser le PDF
		p.showPage()
		p.save()

		# Revenir au début du buffer
		buffer.seek(0)

		# Retourner le PDF en réponse HTTP
		return HttpResponse(buffer, content_type='application/pdf')

	# Si le format n'est pas PDF, retourner les informations en JSON
	return JsonResponse(user_info, safe=False)