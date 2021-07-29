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
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import re_path
from graphene_django.views import GraphQLView

from api.schema import schema
from ui import views as ui

handler404 = 'ui.views.page_not_found'

urlpatterns = [
                  # Client UI routes
                  re_path(r'^$', ui.home, name='home'),
                  re_path(r'^prehled$', ui.home, name='home'),
                  re_path(r'^guests$', ui.home, name='home'),
                  re_path(r'^apartma$', ui.home, name='home'),
                  re_path(r'^login$', ui.login, name='login'),

                  # Admin section
                  re_path('admin/', admin.site.urls),

                  # GraphQL
                  re_path('api', GraphQLView.as_view(graphiql=True, schema=schema)),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
