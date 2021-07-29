from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required(login_url='/login')
def home(request):
    return render(request, 'index.html')


def login(request):
    return render(request, 'index.html')


def page_not_found(request, _exception):
    return render(request, 'index.html')
