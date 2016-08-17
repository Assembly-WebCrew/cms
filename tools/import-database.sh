#!/usr/bin/env bash
if [ -z "$1" ]; then
	echo "usage: import-database.sh </path/to/sql/dump.sql.gz> [-h hostname] [-u username] [-p password]"
	exit
fi

DATABASE="asmweb"
USERNAME="asmweb"
PASSWORD="asmweb"
PGARGS=""

for ((i=1 ; i <= $# ; i++))
do
  var=${@:i:1}
  if [ "$var" == "-h" ]; then
    PGARGS="$PGARGS --host ${@:i+1:1}"
  elif [ "$var" == "-d" ]; then
    DATABASE=${@:i+1:1}
  elif [ "$var" == "-u" ]; then
    USERNAME=${@:i+1:1}
  elif [ "$var" == "-p" ]; then
    PASSWORD=${@:i+1:1}
  fi
done

export PGPASSWORD=${PASSWORD}
PGARGS="$PGARGS --dbname=$DATABASE --username $USERNAME"
psql ${PGARGS} -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'asmweb' AND pid <> pg_backend_pid();" > import.log 2>&1
psql ${PGARGS} -d postgres -c "DROP DATABASE $DATABASE;" >> import.log 2>&1
psql ${PGARGS} -d postgres -c "CREATE DATABASE $DATABASE OWNER $USERNAME;" >> import.log 2>&1
gzip -dc $1 | psql ${PGARGS} -d asmweb >> import.log 2>&1