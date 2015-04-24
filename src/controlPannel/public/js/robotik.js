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
    $('#KI').val(robotik.ki).next().addClass('active');
    $('#KP').val(robotik.kp).next().addClass('active');
    $('#KD').val(robotik.kd).next().addClass('active');
    $('#DT').val(robotik.dt).next().addClass('active');

    /* Items */
    var $select       = $('.selectContainer select').empty();
    var $modalContent = $('#modalConsts .modal-content');
    $select.append('<option value="" disabled selected>Type d\'objet</option>');

    for (var i = robotik.items.length - 1; i >= 0; i--) {
      $select.append('<option value="' + robotik.items[i][0] + '">' + robotik.items[i][1] + '</option>');
      // Add the const for the item
      var html = '<div class="row"><div class="input-field col s12">';
      html    += '<input type="text" id="' + robotik.items[i][0] + '" value="' + robotik.items[i][2] + '">';
      html    += '<label for="' + robotik.items[i][0] + '" class="active">' + robotik.items[i][1] + '</label>';
      html    += '</div></div>';
      $modalContent.append(html);
    }

    /* Messages */
    data.messages.forEach(function(message) {
      window.robotik.addMessage(message);
    });

    $('select').material_select();
    $('ul.tabs').tabs();
    $('.modal-trigger').leanModal();
  });

  robotik.io.on('getPosition', function(status) {
    $('#status').val('x: ' + status.x + ', y: ' + status.y +
      ', orientation: ' + status.orientation);
  });
}());
