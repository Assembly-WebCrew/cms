#!/usr/bin/env bash

if [ $1 ]; then
    dropdb asmweb
    createdb asmweb -O asmweb
    psql asmweb < $1
else
    echo "Missing required argument: /path/to/sql/dump"
fi
