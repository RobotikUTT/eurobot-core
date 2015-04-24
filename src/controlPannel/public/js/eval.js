(function () {
  'use strict';

  var $eval   = $('#eval');
  var history = [];
  var index   = 0;

  $eval.keyup(function (e) {
    if (e.keyCode === 13 && (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey)) {
      doSend($eval.val());
      e.stopPropagation();
    }
    else if (e.keyCode == 38) {
      if (index) {
        index--;
        $eval.val(history[index]);
      }
    }
    else if (e.keyCode == 40) {
      if (index < history.length) {
        index++;
        $eval.val(history[index]);
      }
    }
  });

  function doSend (code) {
    if (code) {
      history.push(code);
      index = history.length;

      window.robotik.io.emit('eval', code);
      $eval.val('');
    }
  }

}());