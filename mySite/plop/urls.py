from django.urls import path
from .views import button_view, button_clicked_view, callback_view

urlpatterns = [
	path('', button_view, name='button_view'),
	path('button_clicked/', button_clicked_view, name='button_clicked'),
	path('callback/', callback_view, name='callback'),
]
