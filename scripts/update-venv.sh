#!/usr/bin/env bash
cd /vagrant
source /home/vagrant/env/bin/activate
pip install -r requirements.txt --upgrade
python manage.py migrate
deactivate