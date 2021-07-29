"""kamenice_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url
from django.contrib import admin
from django.urls import re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.static import serve
from graphene_django.views import GraphQLView

from api.schema import schema
from ui import views as ui

handler404 = 'ui.views.page_not_found'

urlpatterns = [
    # Client UI routes
    url(r'^$', ui.home, name='home'),
    url(r'^prehled$', ui.home, name='home'),
    url(r'^guests$', ui.home, name='home'),
    url(r'^apartma$', ui.home, name='home'),
    url(r'^login$', ui.login, name='login'),

    # Admin section
    url('admin/', admin.site.urls),

    # GraphQL
    url('api', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),

    # Static
    re_path(r'^static/(?P<path>.*)$', serve, {
        'document_root': settings.STATIC_ROOT,
    }),

    # Catch all
    url(r'^.*$', ui.home, name='404'),
]
