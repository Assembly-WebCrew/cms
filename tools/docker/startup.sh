#!/usr/bin/env bash

set -e

export PGPASSWORD="asmweb"
until psql -h "db" -U "asmweb" -c '\l' > /dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - updating environment"
bash ./tools/update-environment.sh --import-database --database-host db
>&2 echo "Environment updated - starting Django-CMS"
python manage.py runserver 0.0.0.0:8000