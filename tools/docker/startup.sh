#!/usr/bin/env bash

set -e

host="$1"
shift
cmd="$@"

export PGPASSWORD="asmweb"
until psql -h "$host" -U "asmweb" -c '\l' > /dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
echo $cmd
exec $cmd