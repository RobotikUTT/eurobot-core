(function () {
  'use strict';

  var $tabs = $('main .content ul li a');
  $tabs.click(function (e) {
    var $self         = $(this);
    var target        = $self.data('target');
    var $target       = $(target);
    var $contentParts = $('.contentPart');

    var $sidebars     = $('.sidebar.right');
    var $sidebar      = $($self.data('sidebar'));

    if (!$self.hasClass('active')) {
      $contentParts.filter('.active').removeClass('active').fadeOut(function () {
        $target.fadeIn().addClass('active');
      });

      // Use not to avoid animation bug
      $sidebars.not($sidebar).fadeOut(function () {
        $sidebar.fadeIn();
      });
    }
  });
}());