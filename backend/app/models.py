from django.db import models

class UserModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=32)
    admin = models.BooleanField()
    mobile = models.BigIntegerField()
    email = models.CharField(max_length=64)

    class Meta:
        db_table = 'user'
