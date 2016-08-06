#!/usr/bin/env bash
if [ -z "$1" ]; then
	echo "usage: export-database.sh <database name> [-h hostname] [-u username] [-p password]"
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

DATABASE_NAME=$1
CURRENT_TIME=$(date "+%d%m%Y_%H%M%S")
DUMP_NAME="${DATABASE_NAME}-${CURRENT_TIME}.sql.gz"
echo "Dumping database to ~/dumps/${DUMP_NAME}"
pg_dump $HOSTNAME $USERNAME -d $DATABASE_NAME | gzip > ~/dumps/$DUMP_NAME