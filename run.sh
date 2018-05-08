#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <mac-address>"
    exit 1
fi

cd "$(dirname "$0")"
sudo node ./index.js "$1" > /dev/snd/midi*

