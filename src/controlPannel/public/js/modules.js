(function () {
  'use strict';

  var io       = window.robotik.io;


  /*
    Motors
   */

  var $stopBtn   = $('.motorStop'),
    $goToBtn     = $('#motorGoTo'),
    $turnBtn     = $('#motorTurn'),
    $tuningsBtn  = $('#setTunings'),
    $resetOdoBtn = $('#resetOdometry'),
    $xPos        = $('#xPos'),
    $yPos        = $('#yPos'),
    $forceFace   = $('#forceFace'),
    $angle       = $('#angle'),
    $KP          = $('#kp > input'),
    $KI          = $('#ki > input'),
    $KD          = $('#kd > input'),
    $DT          = $('#dt > input');

   // Stop
  $stopBtn.click(function() {
    io.emit('stopMotor');
  });

  // GoTo
  $goToBtn.click(function() {
    io.emit('goToMotor', { point: { x: parseFloat($xPos.val()), y: parseFloat($yPos.val()) },
      forceFace: $forceFace.is(':checked') });
  });

  // Turn
  $turnBtn.click(function() {
    io.emit('turnMotor', { angle: $angle.val() });
  })

  // Odometry
  $resetOdoBtn.click(function() {
    io.emit('resetOdometry');
  });


  /*
    Clamp
   */

  $('#elevInit').click(function() {
    io.emit('stepInit', { motor: 'elev' });
  });
  $('#clampInit').click(function() {
    io.emit('stepInit', { motor: 'clamp' });
  });

  $('#elevValid').click(function() {
    $('#elev').submit();
  });
  $('#clampValid').click(function() {
    $('#clamp').submit();
  });

  $('#elev').submit(function() {
    io.emit('stepGoto', { motor: 'elev', pos: $('#elev > input').val() });
    return false;
  });
  $('#clamp').submit(function() {
    io.emit('stepGoto', { motor: 'clamp', pos: $('#clamp > input').val() });
    return false;
  });

  $('#elevStop').click(function() {
    io.emit('stepStop', { motor: 'elev' });
  });
  $('#clampStop').click(function() {
    io.emit('stepStop', { motor: 'clamp' });
  });

  $('#elevUpdate').click(function() {
    io.emit('stepGetpos');
  });
  $('#clampUpdate').click(function() {
    io.emit('stepGetpos');
  });

}());