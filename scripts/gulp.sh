#!/usr/bin/env bash
cd /vagrant/frontend
bower install --config.interactive=false
npm install --upgrade --no-bin-links
gulp
