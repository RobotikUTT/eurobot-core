(function () {
  'use strict';

  window.robotik = {
    io: io(),
    isPaused: true
  };

  robotik.io.on('init', function (data) {
    robotik.distance = {
      kp: data.distance.kp,
      ki: data.distance.ki,
      kd: data.distance.kd
    };

    robotik.orientation = {
      kp: data.orientation.kp,
      ki: data.orientation.ki,
      kd: data.orientation.kd
    };

    robotik.dt = data.dt;

    robotik.items = data.items;

    /* Consts */
    $('#kiDistance > input').val(robotik.distance.ki);
    $('#kpDistance > input').val(robotik.distance.kp);
    $('#kdDistance > input').val(robotik.distance.kd);
    $('#kiOrientation > input').val(robotik.orientation.ki);
    $('#kpOrientation > input').val(robotik.orientation.kp);
    $('#kdOrientation > input').val(robotik.orientation.kd);
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

    /* Status icons */
    var hasBeenDown = false;
    var $socketStatus = $('#socketStatus');
    (function checkServer () {
      if (!window.robotik.io.connected) {
        hasBeenDown = true;
        $socketStatus.removeClass('green-text').addClass('red-text');
      } else {
        if (hasBeenDown) {
          location.reload();
        }
        $socketStatus.removeClass('red-text').addClass('green-text');
      }
      setTimeout(checkServer, 400);
    }());

    robotik.io.on('updateStatus', function(data) {
     if (data.status) {
       $('#'+ data.board +'Status').removeClass('red-text').addClass('green-text');
     } else {
       $('#'+ data.board +'Status').removeClass('green-text').addClass('red-text');
     }
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

  robotik.editor = ace.edit('eval');
  robotik.editor.getSession().setMode('ace/mode/javascript');

}());
