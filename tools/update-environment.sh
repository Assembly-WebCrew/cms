#!/usr/bin/env bash

function write_start() {
  printf "Starting $1..."
}

function write_done() {
  printf "Done\n"
}

USE_VENV=false
PRODUCTION=false

for var in "$@"
do
  echo looping $var
  if [ "$var" == "--use-venv" ]; then
    USE_VENV=true
  elif [ "$var" == "--production" ]; then
    PRODUCTION=true
  fi
done

if [ "$USE_VENV" == true ]; then
  echo Activating pythong virtual environment
  source env/bin/activate
fi

# Update python module requirements
write_start "python module update"
echo "\nRunning pip install\n" >> update.log
if [ "$PRODUCTION" == true ]; then
  REQUIREMENTS_FILE=requirements.locked.txt
else
  REQUIREMENTS_FILE=requirements.txt
fi
pip install -r $REQUIREMENTS_FILE --upgrade > update.log 2>&1
write_done

# Update frontend dependencies
write_start frontend asset update
echo "\nnpm bower install\n" >> update.log
npm install >> update.log 2>&1
echo "\nRunning bower install\n" >> update.log
bower install --allow-sudo >> update.log 2>&1 # TODO: Deprecate Bower entirely
write_done

# Apply migrations to database
write_start database migrations
echo "\nRunning manage.py migrate\n" >> update.log
python manage.py migrate >> update.log 2>&1
write_done

if [ "$USE_VENV" == true ]; then
  deactivate
fi