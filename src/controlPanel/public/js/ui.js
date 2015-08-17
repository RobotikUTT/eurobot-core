function resizeCharts() {
    var distChartContainer = charts.distanceChart.$container;
    var oriChartContainer = charts.orientationChart.$container;

    distChartContainer.width(distChartContainer.parent().width());
    oriChartContainer.width(oriChartContainer.parent().width());
    distChartContainer.height($(window).height() / 2);
    oriChartContainer.height($(window).height() / 2);
}


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

        switch($page.attr('id')) {
            case 'motionMonitorContainer':
                resizeCharts();
                charts.distanceChart.init();
                charts.orientationChart.init();
                break;

            default:
        }
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