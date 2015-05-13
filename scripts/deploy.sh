#!/bin/bash
# Script that deploy build code the embeeded linux
prodIp=${EUROBOT_BOTIP:-bot}
echo "To set destination IP, use :"
echo "export EUROBOT_BOTIP=192.168.0.1"
echo "----------- Kill script -----------"
ssh user@"$prodIp" "pkill node -n"
ssh user@"$prodIp" "sudo systemctl stop prod"
echo "----------- Deploy destination : $prodIp -----------"
rsync -v --exclude '*.map' -a --delete build/src gulpfile.js package.json scripts user@"$prodIp":dev/
echo "----------- Deploy over, start script -----------"
ssh user@"$prodIp" "cd /home/user/dev/ & node /home/user/dev/src/main.js"
echo "----------- Kill script -----------"
ssh user@"$prodIp" "pkill node -n"