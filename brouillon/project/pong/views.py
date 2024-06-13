from django.template import loader
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
# from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.views import generic
from .models import RegisterForm, LoginForm, Login
from .forms import UserLoginForm, UserRegistrationForm

# Create your views here.

def index(request):
    template = loader.get_template('pong/index.html')
    return HttpResponse(template.render())

def home(request):
    template = loader.get_template('pong/home.html')
    return HttpResponse(template.render())

async def getRegistered(request):
    model = Login
    template_name = 'pong/register.html'
    form_class = RegisterForm
    success_url = '/pong/home/'
    if request.method == "POST":
        form = UserRegistrationForm(request.POST or None)
        # print(form)
        if form.is_valid():
            user = await Login.objects.create(
                username1=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
                email=form.cleaned_data['email'])
            user.save()
            return HttpResponseRedirect('/pong/login')
        else:
            print("Form is not valid")
            return HttpResponseRedirect('/pong/register')
    else:
        form = UserRegistrationForm()
    return render(request, "pong/register.html", { 'form': form })

async def getLogged(request):
    model = Login
    form_class = LoginForm
    success_url = '/pong/home/'
    template_name = "pong/login.html"
    if request.method == 'POST':
        form = UserLoginForm(request.POST or None)
        if form.is_valid():
            username1 = form.cleaned_data["username"]
            password1 = form.cleaned_data["password"]
            user = await authenticate(request, username=username1, password=password1)
            if user is not None:
                login(request, user)
                return redirect(success_url)
    else:
        print("Error")
        form = UserLoginForm()
    return render(request, "pong/login.html", { 'form': form })
