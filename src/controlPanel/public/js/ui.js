function initUI() {
    var $allLinks = $('a', '.nav-sidebar');
    var $allPages = $('.main').hide();
    $allPages.first().show();

    var shortcuts = [];
    for (var i = 0; i < $allLinks.length; i++) {
        shortcuts.push(49+i);
    }



    /*
        Listeners
     */

    // Links and pages
    $allLinks.on('click', function(e) {
        e.preventDefault();

        var $link = $(this);
        var $page = $($link.attr('href'));

        $allPages.hide();
        $page.show();
        $allLinks.parent().removeClass('active');
        $link.parent().addClass('active');

        $(window).trigger('resize');
    });

    // Keyboard shortcuts
    $('body').on('keydown', function(e) {
        if ((e.target !== this) || (shortcuts.indexOf(e.keyCode) == -1)) {
            return;
        }

        e.preventDefault();
        $allLinks[e.keyCode - 49].click();
    });

    // Form submit
    $('input[type=text]').on('keydown', function(e) {
        var parentForm = $(this.form);

        if (e.keyCode === 13 && parentForm) {
            e.preventDefault();
            parentForm.submit();
        }
    });


    // Bind all "dt" input together
    $dts = $('#dtDistPInput, #dtOriPInput, #dtDistVInput, #dtOriVInput');

    $dts.on('keyup', function(e) {
        $dts.val($(this).val());
    });
}


$(function() {
    initUI();
});