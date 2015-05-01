(function () {
  'use strict';

  var $btns              = $('.sidebar.left .buttons .btn');
  var $messagesContainer = $('.sidebar.left .messages');
  var $clearLog          = $('#clearLog');

  var mapIcons = {
    'info': 'mdi-action-info',
    'debug': 'mdi-action-settings',
    'warn': 'mdi-alert-warning',
    'error': 'mdi-alert-error'
  };

  var mapColors = {
    'info': 'blue',
    'debug': 'grey',
    'warn': 'orange',
    'error': 'red'
  };

  var hidden = {
    'info': false,
    'debug': false,
    'warn': false,
    'error': false
  };

  window.robotik.addMessage = function(data) {
    var $message = $('<div class="message ' + data.level + '"></div>');
    var $i = $('<i class="' + mapIcons[data.level] +' left ' + mapColors[data.level] +'-text"></i>');
    $message.append($i);
    $message.append(data.msg);

    if (hidden[data.level]) {
      $message.hide();
    }

    $messagesContainer.prepend($message);
  };

  $btns.click(function () {
    var $self = $(this).toggleClass('active darken-4');
    var toFilter = $self.data('msg');

    var $messages = $('.message.' + toFilter, $messagesContainer);
    if ($self.hasClass('active')) {
      $messages.slideDown('fast');
      hidden[toFilter] = false;
    } else {
      $messages.slideUp('fast');
      hidden[toFilter] = true;
    }
  });

  $clearLog.click(function () {
    $messagesContainer.empty();
  });

  window.robotik.io.on('log', window.robotik.addMessage);
}());
