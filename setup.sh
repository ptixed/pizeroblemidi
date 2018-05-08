#!/bin/bash

set +x

if [ -z "$1" ]; then
    echo "Usage: $0 <mac-address>"
    exit 1
fi

# recompile
sudo apt-get install python libudev-dev -y
rm -rf node_modules
npm install

# setup otg midi
echo "dtoverlay=dwc2" | sudo tee -a /boot/config.txt
echo "dwc2" | sudo tee -a /etc/modules
echo "g_midi" | sudo tee -a /etc/modules

# autostart (optional)
tac /etc/rc.local | sed "\|exit 0|a $(pwd)/run.sh '$1' &" | tac | sudo tee /etc/rc.local

reboot

