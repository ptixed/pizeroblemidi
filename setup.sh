#!/bin/bash

set +x

sudo apt-get install python libudev-dev -y

rm -rf node_modules
npm install

