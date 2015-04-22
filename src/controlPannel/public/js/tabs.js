(function () {
  'use strict';

  var $tabs = $('main .content ul li a');
  $tabs.click(function (e) {
    var $self         = $(this);
    var target        = '.' + $self.data('target').slice(1);
    var $target       = $(target);
    var $contentParts = $('.contentPart');

    if (!$self.hasClass('active')) {
      $contentParts.filter('.active').removeClass('active').fadeOut(function () {
        $target.fadeIn().addClass('active');
      });
    }
  });
}());