import requests
from django.http import HttpResponse
from django.conf import settings
from django.shortcuts import render, redirect

def button_view(request):
	return render(request, 'plop/button_template.html')


def get_42_token():
    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": settings.FORTYTWO_CLIENT_ID,
        "client_secret": settings.FORTYTWO_CLIENT_SECRET
    }
    
    response = requests.post(token_url, data=data)
    response.raise_for_status()
    token_info = response.json()
    return token_info['access_token']

def get_user_info(token):
	user_info_url = "https://api.intra.42.fr/v2/me"
	headers = {"Authorization": f"Bearer {token}"}
	response = requests.get(user_info_url, headers=headers)
	response.raise_for_status()
	return response.json()

def button_clicked_view(request):
    if request.method == "POST":
        auth_url = "https://api.intra.42.fr/oauth/authorize"
        client_id = settings.FORTYTWO_CLIENT_ID
        redirect_uri = "https://localhost:8000/callback/"
        scope = 'public'
        url = f"{auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}"
        return redirect(url)
    return HttpResponse("Please click the button.")

def callback_view(request):
    code = request.GET.get('code')
    if not code:
        return HttpResponse("Authorization code not found.", status=400)

    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        "grant_type": "authorization_code",
        "client_id": settings.FORTYTWO_CLIENT_ID,
        "client_secret": settings.FORTYTWO_CLIENT_SECRET,
        "code": code,
        "redirect_uri": "https://localhost:8000/callback/"  # Ensure this matches the registered redirect URI
    }
    
    try:
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        token_info = response.json()
        access_token = token_info['access_token']

        user_info = get_user_info(access_token)
        context = {
            'name': user_info.get('first_name', '') + ' ' + user_info.get('last_name', ''),
            'email': user_info.get('email', 'Not available'),
            'image_url': user_info.get('image_url', 'default_image_url')  # Use default if key is missing
        }
        return render(request, 'plop/user_info.html', context)
    
    except requests.HTTPError as e:
        return HttpResponse(f"An error occurred: {e.response.text}", status=e.response.status_code)
