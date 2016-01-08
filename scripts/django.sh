#!/usr/bin/env bash
cd /vagrant
source /home/vagrant/env/bin/activate
python manage.py runserver 0.0.0.0:8000