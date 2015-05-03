(function () {
  'use strict';

  window.robotik = {
    io: io(),
    isPaused: false
  };

  robotik.io.on('init', function (data) {
    robotik.distance = {
      kp: data.distance.kp,
      ki: data.distance.ki,
      kd: data.distance.kd,
      dt: data.distance.dt
    };

    robotik.orientation = {
      kp: data.orientation.kp,
      ki: data.orientation.ki,
      kd: data.orientation.kd,
      dt: data.orientation.dt
    };

    robotik.items = data.items;

    /* Consts */
    $('#ki > input').val(robotik.distance.ki);
    $('#kp > input').val(robotik.distance.kp);
    $('#kd > input').val(robotik.distance.kd);
    $('#dt > input').val(robotik.distance.dt);

    /* Consts */
    $('#kiOrient > input').val(robotik.orientation.ki);
    $('#kpOrient > input').val(robotik.orientation.kp);
    $('#kdOrient > input').val(robotik.orientation.kd);
    $('#dtOrient > input').val(robotik.orientation.dt);

    /* Items */
    robotik.items.forEach(function (item) {
      $('.update-th').before('<td>' + item[1] + '</td>');
      $('.update-tb').before('<td id="' + item[0] + '"><input type="text" placeholder="' + item[1] + '" value="' + item[2] + '"></td>')
    });

    /* Messages */
    data.messages.forEach(function(message) {
      window.robotik.addMessage(message);
    });

    /* Status icons */
    var $socketStatus = $('#socketStatus');
    (function checkServer () {
      if (!window.robotik.io.connected) {
        $socketStatus.removeClass('green-text').addClass('red-text');
      } else {
        $socketStatus.removeClass('red-text').addClass('green-text');
      }
      setTimeout(checkServer, 400);
    }());

    robotik.io.on('updateStatus', function(data) {

    });

    window.robotik.chart();

    $('select').material_select();
    $('ul.tabs').tabs();
    $('.modal-trigger').leanModal();
  });

  robotik.io.on('getPosition', function(status) {
    $('#status').html(
      '<strong>x:</strong> ' + status.point.x + '<br>' +
      '<strong>y:</strong> ' + status.point.y + '<br>' +
      '<strong>rad:</strong> ' + status.orientation + '<br>' +
      '<strong>deg:</strong> ' + (parseFloat(status.orientation) * 57.2957795).toString());

    var orientationTarget = robotik.highcharts[0].highcharts().series[0];
    var orientationValue  = parseFloat(status.orientation) * 57.2957795;
    if (!robotik.isPaused) {
      var i = robotik.highcharts[0].i;
      orientationTarget.addPoint([i, orientationValue], true, i > 100);
      ++robotik.highcharts[0].i;
    }

    var doneTarget = robotik.highcharts[1].highcharts().series[0];
    var doneValue  = Math.sqrt(Math.pow(status.point.x, 2) + Math.pow(status.point.y, 2));
    if (!robotik.isPaused) {
      var i = robotik.highcharts[1].i;
      doneTarget.addPoint([i, doneValue], true, i > 100);
      ++robotik.highcharts[1].i;
    }
  });

  robotik.io.on('clampPos', function(data) {
    $('#elev > input').val(data.elev);
    $('#clamp > input').val(data.clamp);
  });

}());
