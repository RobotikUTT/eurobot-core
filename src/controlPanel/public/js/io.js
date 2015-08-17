$(function() {
    window.io = io();

    // Odometry updates
    io.on('newState', function(state) {
        var distancePos    = Math.sqrt(Math.pow(state.point.x, 2) +
            Math.pow(state.point.y, 2));
        // Convert rad -> degrees
        var orientationPos = parseFloat(state.orientation) * 57.2957795;

        charts.distanceChart.addPoints({ position: distancePos, velocity: 0 });
        charts.orientationChart.addPoints({ position: orientationPos, velocity: 0 });
    });

    // Send forms through websockets
    $("#motionSettingsForm").on('submit', function(e) {
        e.preventDefault();
        io.emit('motionSettings', {
            distance: {
                position: {
                    P: $('#PDistPInput').val(),
                    I: $('#IDistPInput').val(),
                    D: $('#DDistPInput').val()
                },
                velocity: {
                    P: $('#PDistVInput').val(),
                    I: $('#IDistVInput').val(),
                    D: $('#DDistVInput').val()
                },
                dt: $('#dtDistPInput').val()
            },
            orientation: {
                position: {
                    P: $('#POriPInput').val(),
                    I: $('#IOriPInput').val(),
                    D: $('#DOriPInput').val()
                },
                velocity: {
                    P: $('#POriVInput').val(),
                    I: $('#IOriVInput').val(),
                    D: $('#DOriVInput').val()
                },
                dt: $('#dtOriVInput').val()
            }
        });
    });
})