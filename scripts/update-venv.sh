#!/usr/bin/env bash
cd /vagrant
source env/bin/activate
pip install -r requirements.txt --upgrade
python manage.py migrate
deactivate