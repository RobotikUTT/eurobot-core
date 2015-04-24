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
    $KP          = $('#KP'),
    $KI          = $('#KI'),
    $KD          = $('#KD'),
    $DT          = $('#DT');

   // Stop
  $stopBtn.click(function() {
    io.emit('stopMotor');
  });

  // GoTo
  $goToBtn.click(function() {
    io.emit('goToMotor', { point: { x: $xPos.val(), y: $yPos.val() },
      forceFace: $forceFace.is(':checked') });
  });

  // Turn
  $turnBtn.click(function() {
    io.emit('turnMotor', { angle: $angle.val() });
  })

  // Odometry
  $resetOdoBtn.click(function() {
    io.emit('resetOdometry');
  })
}());
