from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from pong.models import User


# view pour afficher la liste des utilisateurs. Test pour fetch() des donnees du backend/bdd
# @login_required
def user_list_json(request):
	users = User.objects.all().values('id', 'username', 'email')
	return JsonResponse(list(users), safe=False)

# Cette vue rend la page pong/user_list.html
# @login_required
# def user_list(request):
# 	return render(request, 'pong/user_list.html')
def user_list(request):
	users = User.objects.all()
	user_data = []

	for user in users:
		user_data.append({
			'id': user.id,
			'username': user.username,
			'hashed_password': user.password,
		})

	return render(request, 'pong/user_list.html', {'users': user_data})




def index(request):
	template = loader.get_template('pong/index.html')
	return HttpResponse(template.render())

# vue pour afficher la page d'accueil
# render => combines a template with a given context dictionary and returns an HttpResponse object with that rendered tex
@login_required
def home_view(request):
	return render(request, 'pong/home.html')


