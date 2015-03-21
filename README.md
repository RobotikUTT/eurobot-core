# eurobot-2015-core
Javascript code of our embedded linux for Eurobot 2015

Fix gulp-watch
  ```echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p```

Launch gulp for auto build with babel
  ``` gulp& ```

Launch nodemon for automatic reloading
  ```nodemon build/src/main.js```
