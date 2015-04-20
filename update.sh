#!/bin/bash
echo "Pulling repository"
git pull
echo "Cleaning statics"
rm -rf ./static/
echo "Cleaning frontend"
cd frontend && gulp clean
echo "Building frontend"
npm install && bower install && gulp build
echo "Collecting statics"
cd .. && source env/bin/activate && python manage.py collectstatic --noinput
echo "Running migrations"
python manage.py migrate
deactivate
echo "Done"
