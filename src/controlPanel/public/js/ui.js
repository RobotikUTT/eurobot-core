function initUI() {
    var $sideLinks = $('.nav-sidebar a');
    var $navLinks = $('#sidebarLinks a');

    var $allPages = $('.main').hide();
    $allPages.first().show();

    var shortcuts = [];
    for (var i = 0; i < $sideLinks.length; i++) {
        shortcuts.push(49 + i);
    }



    /*
        Listeners
     */

    // Links and pages
    $sideLinks.on('click', function(e) {
        e.preventDefault();

        var $link = $(this);
        var $page = $($link.attr('href'));

        $allPages.hide();
        $page.show();
        $sideLinks.parent().removeClass('active');
        $link.parent().addClass('active');

        $(window).trigger('resize');
    });

    $navLinks.on('click', function(e) {
        e.preventDefault();

        var $link = $(this);
        var $page = $($link.attr('href'));

        $allPages.hide();
        $page.show();
        $navLinks.parent().removeClass('active');
        $link.parent().addClass('active');

        $(window).trigger('resize');
    });

    // Keyboard shortcuts
    $('body').on('keydown', function(e) {
        if ((e.target !== this) || (shortcuts.indexOf(e.keyCode) == -1)) {
            return;
        }

        e.preventDefault();
        var href = $sideLinks.eq(e.keyCode - 49).attr('href');
        $('a[href="'+href+'"]').trigger('click');
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
