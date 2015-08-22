$(function() {
    window.io = io();

    // Odometry updates
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


    /*
        Forms
     */

    // Motion settings
    $('#motionSettingsForm').on('submit', function(e) {
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

        return false;
    });

    // Motors
    $('#goToCarthForm').on('submit', function(e) {
        io.emit('goToMotor', {
            x: $('#xInput').val(),
            y: $('#yInput').val()
        });

        return false;
    });

    $('#runMotorForm').on('submit', function(e) {
        io.emit('runMotor', {
            motor: $('#motorSelect').val(),
            pwm: $('#PWMInput').val()
        });

        return false;
    });

    $('#goToForm').on('submit', function(e) {
        io.emit('goToMotor', {
            distance: $('#distanceInput').val()
        });

        return false;
    });

    $('#turnMotorForm').on('submit', function(e) {
        io.emit('turnMotor', {
            orientation: $('#oriInput').val()
        });

        return false;
    });

    // Clamp
    $('#elevatorForm').on('submit', function(e) {
        io.emit('clampGoTo', {
            motor: 'elev',
            pos: $('#elevatorStepInput').val()
        });

        return false;
    });

    $('#grabForm').on('submit', function(e) {
        io.emit('clampGoTo', {
            motor: 'clamp',
            pos: $('#grabStepInput')
        });

        return false;
    });


    /*
        Buttons
     */

     // Motors
    $('#motorStopBtn').on('click', function(e) {
        io.emit('stopMotor');
    });

    // Clamp
    $('#updateClampBtn').on('click', function(e) {
        io.emit('updateClamp');
    });

    $('#resetClampBtn').on('click', function(e) {
        io.emit('resetClamp');
    });

    $('#elevatorStopBtn').on('click', function(e) {
        io.emit('clampStop', {
            motor: 'elev'
        });
    });

    $('#grabStopBtn').on('click', function(e) {
        io.emit('clampStop', {
            motor: 'clamp'
        });
    });

    // Manual control
    $('#goForward').on('click', function(e) {
        io.emit('goForward');
    });

    $('#turnLeft').on('click', function(e) {
        io.emit('turnLeft');
    });

    $('#goBackward').on('click', function(e) {
        io.emit('goBackward');
    });

    $('#turnRight').on('click', function(e) {
        io.emit('turnRight');
    });

    $('#elevatorUp').on('click', function(e) {
        io.emit('elevatorUp');
    });

    $('#elevatorDown').on('click', function(e) {
        io.emit('elevatorDown');
    });

    $('#clampExpand').on('click', function(e) {
        io.emit('clampExpand');
    });

    $('#clampCompress').on('click', function(e) {
        io.emit('clampCompress');
    });

    $('resetOdometryBtn').on('click', function(e) {
        e.preventDefault();

        io.emit('resetOdometry');
        return false;
    });

    // Motion settings
    $('#centerDistanceBtn').on('click', function(e) {
        io.emit('calibrateCenterDistance');
    });

    $('#wheelRadiusBtn').on('click', function(e) {
        io.emit('calibrateWheelRadius');
    });
});