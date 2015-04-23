(function () {
  'use strict';

  var $eval = $('#eval');

  $eval.keyup(function (e) {
    if (e.keyCode === 13 && (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey)) {
      doSend($eval.val());
      e.stopPropagation();
    }
  });

  function doSend (code) {
    if (code) {
      window.robotik.io.emit('eval', code);
      $eval.val('');
    }
  }

}());