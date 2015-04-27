#!/bin/bash
# Script that deploy build code the embeeded linux
# You can set the board ip in your host file as "prod"
# Or you can do `export EUROBOT_PRODIP=192.168.0.1`
# Config ip
prodIp=${EUROBOT_PRODIP:-robotProd}
echo "To set destination IP, use :"
echo "export EUROBOT_PRODIP=192.168.0.1"
echo "----------- Deploy destination : $prodIp -----------"
rsync -v --exclude '*.map' -a --delete build/src gulpfile.js package.json scripts prod@"$prodIp":dev/
echo "----------- Deploy over, start script -----------"
ssh prod@"$prodIp" "cd /home/prod/dev/ & node /home/prod/dev/src/main.js"
echo "----------- Kill script -----------"
ssh prod@"$prodIp" "pkill node -n"
