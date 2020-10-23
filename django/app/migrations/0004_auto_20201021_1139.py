# Generated by Django 3.1.2 on 2020-10-21 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20201021_1137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='description',
            field=models.CharField(help_text='Excerpt', max_length=200, verbose_name='Excerpt'),
        ),
        migrations.AlterField(
            model_name='product',
            name='longDescr',
            field=models.CharField(blank=True, help_text='Description', max_length=600, verbose_name='Description'),
        ),
    ]
