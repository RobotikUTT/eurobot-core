#!/bin/bash
# Script that deploy build code the embeeded linux
# You can set the board ip in your host file as "prod"
# Or you can do `export EUROBOT_PRODIP=192.168.0.1`
# Config ip
prodIp=${EUROBOT_PRODIP:-prod}
echo "To set destination IP, use :"
echo "export EUROBOT_PRODIP=192.168.0.1"
echo "----------- Deploy destination : $prodIp -----------"
rsync -v --exclude '*.map' -a --delete build/src package.json prod@"$prodIp":dev/
echo "----------- Deploy over, start script -----------"
ssh prod@"$prodIp" "cd /home/prod/dev/ & node /home/prod/dev/src/main.js"
echo "----------- Kill script -----------"
<<<<<<< HEAD
ssh prod@"$prodIp" "pkill node -n"
=======
ssh prod@"$prodIp" "pkill node -n"
>>>>>>> eb7eefda242ad8f09520af2ce30d806dc01c0e5f
