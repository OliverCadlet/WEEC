from django.shortcuts import render
from .models import Task

# Create your views here.
def landing(request):
    return render(request, 'landing.html')

def landing(request):
    tasks = Task.objects.all()  # Fetch all tasks from the database
    return render(request, 'landing.html', {'tasks': tasks})