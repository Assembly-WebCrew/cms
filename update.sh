#!/bin/bash

skip_backup=false
while getopts 's' flag; do
  case "${flag}" in
    s) skip_backup=true ;;
  esac
done

if [ $skip_backup != 'true' ] ; then
    echo "Backing up current state"
    current_time=$(date "+%d%m%Y_%H%M%S")
    file_name='preupdate_state_'$current_time'.tar.gz'
    tar -zcvf ~/backups/$file_name ./ &> /dev/null
fi

echo "Pulling repository"
git pull && git submodule init && git submodule update && git submodule status
echo "Cleaning statics"
rm -rf ./static/
echo "Cleaning frontend"
gulp clean
echo "Building frontend"
npm install && bower install && gulp build
source env/bin/activate
echo "Updating Python modules"
pip install -r requirements.txt
echo "Collecting statics"
python manage.py collectstatic --noinput
echo "Running migrations"
python manage.py migrate
deactivate
echo "Done"
