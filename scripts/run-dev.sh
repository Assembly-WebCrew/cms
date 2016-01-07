#!/usr/bin/env bash
# Start frontend project gulp watch
screen -dmS gulp /vagrant/scripts/gulp.sh
# Start Django server
screen -dmS django /vagrant/scripts/django.sh
