(function () {
  'use strict';

  $('.saveConsts').click(function (e) {
    e.preventDefault();

    window.robotik.kp = parseFloat($('#kp > input').val());
    window.robotik.ki = parseFloat($('#ki > input').val());
    window.robotik.kd = parseFloat($('#kd > input').val());
    window.robotik.dt = parseFloat($('#dt > input').val());

    for (var i = window.robotik.items.length - 1; i >= 0; i--) {
      window.robotik.items[i][2] = parseFloat($('#' + window.robotik.items[i][0] + ' > input').val());
    }

    window.robotik.io.emit('setTunings', {
      kp: window.robotik.kp, ki: window.robotik.ki,
      kd: window.robotik.kd, dt: window.robotik.dt
    });

    window.robotik.io.emit('setClamp', {
      items: window.robotik.items
    });
  });
}());