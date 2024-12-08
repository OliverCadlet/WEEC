from django.db import models

# Create your models here.
class Task(models.Model):
    name = models.CharField(max_length=200)  # Task name
    due_date = models.DateField()  # Due date for the task
    description = models.TextField()  # Detailed description of the task
    resources = models.TextField(blank=True, null=True)  # Resources or links for the task
    
    def __str__(self):
        return self.name