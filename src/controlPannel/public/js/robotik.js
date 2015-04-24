(function () {
  'use strict';

  window.robotik = {
    io: io()
  };

  robotik.io.on('init', function (data) {
    robotik.kp = data.kp;
    robotik.ki = data.ki;
    robotik.kd = data.kd;
    robotik.dt = data.dt;

    robotik.items = data.items;

    /* Consts */
    $('#ki > input').val(robotik.ki);
    $('#kp > input').val(robotik.kp);
    $('#kd > input').val(robotik.kd);
    $('#dt > input').val(robotik.dt);

    /* Items */
    robotik.items.forEach(function (item) {
      $('.update-th').before('<td>' + item[1] + '</td>');
      $('.update-tb').before('<td id="' + item[0] + '"><input type="text" placeholder="' + item[1] + '" value="' + item[2] + '"></td>')
    });

    /* Messages */
    data.messages.forEach(function(message) {
      window.robotik.addMessage(message);
    });

    $('select').material_select();
    $('ul.tabs').tabs();
    $('.modal-trigger').leanModal();
  });
}());
