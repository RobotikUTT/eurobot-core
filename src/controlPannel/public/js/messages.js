(function () {
  'use strict';

  var $btns              = $('.sidebar.left .buttons .btn');
  var $messagesContainer = $('.sidebar.left .messages');

  $btns.click(function () {
    var $self = $(this).toggleClass('active darken-4');
    var toFilter = $self.data('msg');

    var $messages = $('.message.' + toFilter, $messagesContainer);
    if ($self.hasClass('active')) $messages.slideDown('fast');
    else                          $messages.slideUp('fast');
  });
}());
