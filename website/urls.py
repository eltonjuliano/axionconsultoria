from django.urls import path
from . import views

app_name = 'website'

urlpatterns = [
    path('', views.home, name='home'),
    path('submit-lead/', views.submit_lead, name='submit_lead'),
    path('politica-de-privacidade/', views.privacy_policy, name='privacy_policy'),
]
