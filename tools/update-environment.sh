#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
USE_VENV=false
PRODUCTION=false
IMPORT_DATABASE=false
IMPORT_DATABASE_ARGS=''

function write_start() {
  printf "Starting $1..."
}

function write_done() {
  printf "Done\n"
}

function exit_on_error() {
  if [[ $? != 0 ]]; then
    exit $?;
  fi
}

function import_dump() {
  DUMB_FILE="$BASEDIR/../$(ls -t *.sql.gz | head -1)"
  if [ -f "$DUMB_FILE" ]; then
    write_start "database dump import"
    echo "Importing database dump..." >> update.log
    bash ${BASEDIR}/import-database.sh ${DUMB_FILE} ${IMPORT_DATABASE_ARGS} >> update.log 2>&1
    write_done
  fi
}

while [[ $# -gt 0 ]]
do
key="$1"
case $key in
    -h|--help)
	echo "usage: update-environment.sh [-e | --use-venv] [-p | --production] [-i | --import-database] [-h <address> | --database-host <address>]"
	exit
    ;;
    -e|--use-venv)
    USE_VENV=true
    ;;
    -p|--production)
    PRODUCTION=true
    ;;
    -i|--import-database)
    IMPORT_DATABASE=true
    ;;
    -h|--database-host)
    IMPORT_DATABASE_ARGS="-h $2"
    shift # past argument value
    ;;
    *)
    # unknown option
    ;;
esac
shift
done

echo "Starting environment update..." > update.log

if [ "$IMPORT_DATABASE" == true ]; then
  import_dump
fi

if [ "$USE_VENV" == true ]; then
  echo "Activating pythong virtual environment"
  source env/bin/activate
fi

# Update python module requirements
write_start "python module update"
echo "Running pip install..." >> update.log
if [ "$PRODUCTION" == true ]; then
  REQUIREMENTS_FILE=requirements.lock.txt
else
  REQUIREMENTS_FILE=requirements.txt
fi
pip install -r ${REQUIREMENTS_FILE} --upgrade >> update.log 2>&1
write_done

# Update frontend dependencies
write_start "frontend asset update"
echo "npm bower install..." >> update.log
npm install >> update.log 2>&1
echo "Running bower install..." >> update.log
bower install --allow-root >> update.log 2>&1 # TODO: Deprecate Bower entirely
echo "Build frontend assets..." >> update.log
gulp build >> update.log 2>&1
write_done

# Apply migrations to database
write_start "database migrations"
echo "Running manage.py migrate..." >> update.log
python manage.py migrate >> update.log 2>&1
exit_on_error
write_done

if [ "$USE_VENV" == true ]; then
  deactivate
fi