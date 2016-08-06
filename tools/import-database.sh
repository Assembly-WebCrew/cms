#!/usr/bin/env bash
if [ -z "$1" ]; then
	echo "usage: import-database.sh </path/to/sql/dump.sql.gz> [-h hostname] [-u username] [-p password]"
	exit
fi

for ((i=1 ; i <= $# ; i++))
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

psql $HOSTNAME $USERNAME -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'asmweb' AND pid <> pg_backend_pid();"
psql $HOSTNAME $USERNAME -d postgres -c "DROP DATABASE asmweb;"
psql $HOSTNAME $USERNAME -d postgres -c "CREATE DATABASE asmweb OWNER asmweb;"
gzcat $1 | psql $HOSTNAME $USERNAME -d asmweb