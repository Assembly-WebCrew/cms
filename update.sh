#!/bin/bash
echo "Pulling repository"
git pull
echo "Cleaning statics"
rm -rf ./static/
echo "Cleaning frontend"
cd frontend && gulp clean
echo "Building frontend"
npm install && bower install && gulp build
cd .. && source env/bin/activate
echo "Updating Python modules"
pip install -r requirements.txt
echo "Collecting statics"
python manage.py collectstatic --noinput
echo "Running migrations"
python manage.py migrate
deactivate
echo "Done"
