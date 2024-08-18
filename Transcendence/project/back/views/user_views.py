from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from back.models import User


def index(request):
	template = loader.get_template('pong/index.html')
	return HttpResponse(template.render())

# vue pour afficher la page d'accueil
# render => combines a template with a given context dictionary and returns an HttpResponse object with that rendered tex
@login_required
def home_view(request):
	return render(request, 'pong/base.html')