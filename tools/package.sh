#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
COMMIT=$(git rev-parse --short HEAD)
CURRENT_TIME=$(date "+%d%m%Y_%H%M%S")

function write_start() {
  printf "Starting $1..."
}

function write_done() {
  printf "Done\n"
}

write_start "project build"
bash $BASEDIR/build.sh --use-venv > package.log 2>&1
write_done

write_start "to package files"
mkdir ./deploy >> package.log 2>&1
tar -zcv --exclude='./.git' \
 --exclude='./config' \
 --exclude='./assembly/settings/local.py*' \
 --exclude='./bower_components' \
 --exclude='./deploy' \
 --exclude='./gulp' \
 --exclude='./node_modules' \
 --exclude='./frontend/src' \
 --exclude='./env' \
 --exclude='./tools' \
 --exclude='./src' \
 --exclude='./.gitattributes' \
 --exclude='./.gitignore' \
 --exclude='./.gitmodules' \
 --exclude='./.jshintrc' \
 --exclude='./*.gz' \
 --exclude='./*.sublime*' \
 --exclude='./bower.json' \
 --exclude='./docker-compose.yml' \
 --exclude='./Dockerfile' \
 --exclude='./gulpfile.js' \
 --exclude='./package.json' \
 --exclude='./requirements.txt' \
 --exclude='./*.sh' \
 --exclude='.idea' \
 --exclude='*.log' \
 -f ./deploy/build_${COMMIT}_${CURRENT_TIME}.tar.gz . >> package.log 2>&1
write_done

exit 1