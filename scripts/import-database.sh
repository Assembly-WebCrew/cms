#!/usr/bin/env bash

if [ $1 ]; then
    psql -c "SELECT pg_terminate_backend(pg_stat_activity.procpid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'asmweb' AND procpid <> pg_backend_pid();"
    dropdb asmweb
    createdb asmweb -O asmweb
    zcat $1 | psql -d asmweb
else
    echo "Missing required argument: /path/to/sql/dump"
fi
