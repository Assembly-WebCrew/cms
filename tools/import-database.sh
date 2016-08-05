#!/usr/bin/env bash

for ((i=1 ; i <= $# ; i++))
#for var in "$@"
do
  var=${@:i:1}
  if [ "$var" == "-h" ]; then
    HOSTNAME="-h ${@:i+1:1}"
  elif [ "$var" == "-u" ]; then
    USERNAME="--username ${@:i+1:1}"
  elif [ "$var" == "-p" ]; then
    export PGPASSWORD=${@:i+1:1}
  fi
done

if [ $1 ]; then
  psql $HOSTNAME $USERNAME -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'asmweb' AND pid <> pg_backend_pid();"
  psql $HOSTNAME $USERNAME -d postgres -c "DROP DATABASE asmweb;"
  psql $HOSTNAME $USERNAME -d postgres -c "CREATE DATABASE asmweb OWNER asmweb;"
  gzcat $1 | psql $HOSTNAME $USERNAME -d asmweb
else
  echo "Missing required argument: /path/to/sql/dump"
fi
