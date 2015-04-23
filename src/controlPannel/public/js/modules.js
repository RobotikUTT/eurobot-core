(function () {
  'use strict';

  var io       = window.robotik.io;


  /*
    Motors
   */

  var $stopBtn   = $('.motorStop'),
    $goToBtn     = $('#motorGoTo'),
    $xPos        = $('#xPos'),
    $yPos        = $('#yPos'),
    $forceFace   = $('#forceFace');

   // Stop
  $stopBtn.click(function() {
    io.emit('stopMotor');
  });

  // GoTo
  $goToBtn.click(function() {
    io.emit('goToMotor', { x: $xPos.val(), y: $yPos.val(),
      forceFace: $forceFace.is(':checked') });
  });
}());
