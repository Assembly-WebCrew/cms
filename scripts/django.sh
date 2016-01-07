#!/usr/bin/env bash
cd /vagrant
source env/bin/activate
python manage.py runserver 0.0.0.0:8000