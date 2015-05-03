(function () {
  'use strict';

  var $eval   = $('#eval');
  var history = [];
  var index   = 0;

  robotik.editor.commands.addCommand({
      name: 'sendRobotCtrl',
      bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
      exec: function (editor) {
          doSend(editor.getValue());
      }
  });

  robotik.editor.commands.addCommand({
      name: 'sendRobotShift',
      bindKey: {win: 'Shift-Enter',  mac: 'Shift-Enter'},
      exec: function (editor) {
          doSend(editor.getValue());
      }
  });

  robotik.editor.commands.addCommand({
      name: 'sendRobotAlt',
      bindKey: {win: 'Alt-Enter',  mac: 'Alt-Enter'},
      exec: function (editor) {
          doSend(editor.getValue());
      }
  });

  robotik.editor.commands.addCommand({
      name: 'backHistoryRobot',
      bindKey: {win: 'Ctrl-Up',  mac: 'Ctrl-Up'},
      exec: function (editor) {
        console.log('up', index);
        if (index) {
          index--;
          window.robotik.editor.setValue(history[index]);
        }
      }
  });

  robotik.editor.commands.addCommand({
      name: 'nextHistoryRobot',
      bindKey: {win: 'Ctrl-Down',  mac: 'Ctrl-Down'},
      exec: function (editor) {
        console.log('down', index, history.length);
        if (index < history.length) {
          index++;
          window.robotik.editor.setValue(history[index]);
        }
      }
  });

  function doSend (code) {
    if (code) {
      history.push(code);
      index = history.length;

      window.robotik.io.emit('eval', code);
      window.robotik.editor.setValue('');
    }
  }

}());