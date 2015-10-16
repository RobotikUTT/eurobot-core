$(function() {
    window.io = io();

    // Odometry update
    io.on('odometryUpdate', function(state) {
        console.log(state);
        var distancePos    = Math.sqrt(Math.pow(state.point.x, 2) +
            Math.pow(state.point.y, 2));
        var orientationPos = parseFloat(state.orientation) * 57.2957795; // rad->deg

        // Update charts
        charts.distanceChart.addPoints({ position: distancePos, velocity: 0 });
        charts.orientationChart.addPoints({ position: orientationPos, velocity: 0 });

        // Update odometry infos
        $('#xPosInfo').text(state.point.x);
        $('#yPosInfo').text(state.point.y);
        $('#oriInfo').text(state.orientation);
    });
});
