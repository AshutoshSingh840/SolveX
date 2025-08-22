from django.urls import path
from .views import answer,home
urlpatterns=[
    path('',home,name="home"),
    path('/answer',answer,name="ans")
]