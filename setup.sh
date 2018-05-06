#!/bin/bash

set +x

# recompile
sudo apt-get install python libudev-dev -y
rm -rf node_modules
npm install

# setup otg midi
echo "dtoverlay=dwc2" | sudo tee -a /boot/config.txt
echo "dwc2" | sudo tee -a /etc/modules
echo "g_midi" | sudo tee -a /etc/modules
reboot

