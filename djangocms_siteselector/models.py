from django.db import models
from django.contrib.sites.models import Site


class SiteInstance(models.Model):
    site = models.OneToOneField(Site)
    slug = models.CharField(max_length=10, blank=False, null=False)
    default = models.BooleanField()

    def name(self):
        return self.site.name

    def save(self, *args, **kwargs):
        if self.default:
            try:
                temp = SiteInstance.objects.get(default=True)
                if self != temp:
                    temp.default = False
                    temp.save()
            except SiteInstance.DoesNotExist:
                pass
        super(SiteInstance, self).save(*args, **kwargs)
