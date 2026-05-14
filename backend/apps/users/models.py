from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User – extends AbstractUser with extra fields.
    Use USERNAME_FIELD = 'email' so users log in with email.
    """

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, default="")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "Người dùng"
        verbose_name_plural = "Người dùng"

    def __str__(self):
        return self.email
