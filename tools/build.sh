#!/usr/bin/env bash

function write_start() {
  printf "Starting $1..."
}

function write_done() {
  printf "Done\n"
}

USE_VENV=false

for var in "$@"
do
  if [ "$var" == "--use-venv" ]; then
    USE_VENV=true
  fi
done

if [ "$USE_VENV" == true ]; then
  echo "Activating pythong virtual environment"
  source env/bin/activate
fi

write_start "building frontend assets"
gulp build >> build.log 2>&1
write_done
write_start "collecting static files"
python manage.py collectstatic > build.log 2>&1
write_done

if [ "$USE_VENV" == true ]; then
  deactivate
fi