(function () {
  'use strict';

  $('.saveConsts').click(function () {
    window.robotik.kp = $('#KP').val();
    window.robotik.ki = $('#KI').val();
    window.robotik.kd = $('#KD').val();
    window.robotik.dt = $('#DT').val();

    for (var i = window.robotik.items.length - 1; i >= 0; i--) {
      window.robotik.items[i][2] = $('#' + window.robotik.items[i][0]).val();
    }

    window.robotik.io.emit('data', {
      kp: window.robotik.kp,
      ki: window.robotik.ki,
      kd: window.robotik.kd,
      dt: window.robotik.dt,
      items: window.robotik.items
    });
  });
}());