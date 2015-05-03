(function () {
  'use strict';

  $('.saveConsts').click(function (e) {
    e.preventDefault();

    window.robotik.orientation = {};
    window.robotik.distance = {};

    window.robotik.orientation.kp = parseFloat($('#kpOrientation > input').val());
    window.robotik.orientation.ki = parseFloat($('#kiOrientation > input').val());
    window.robotik.orientation.kd = parseFloat($('#kdOrientation > input').val());
    window.robotik.distance.kp = parseFloat($('#kpDistance > input').val());
    window.robotik.distance.ki = parseFloat($('#kiDistance > input').val());
    window.robotik.distance.kd = parseFloat($('#kdDistance > input').val());

    window.robotik.dt = parseFloat($('#dt > input').val());

    for (var i = window.robotik.items.length - 1; i >= 0; i--) {
      window.robotik.items[i][2] = parseFloat($('#' + window.robotik.items[i][0] + ' > input').val());
    }

    window.robotik.io.emit('setTunings', {
      orientation: window.robotik.orientation,
      distance: window.robotik.distance,
      dt: window.robotik.dt
    });

    window.robotik.io.emit('setClamp', {
      items: window.robotik.items
    });
  });
}());