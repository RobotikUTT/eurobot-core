(function () {
	'use strict';

	// Key codes to improve readability
	var k = {
		'esc' : 27,
		'del' : 46,
		'alt' : 18,
		'A' : 65,
		'D' : 68,
		'E' : 69,
		'F' : 70,
		'I' : 73,
		'O' : 79,
		'P' : 80,
		'Q' : 81,
		'R' : 82,
		'S' : 83,
		'U' : 85,
		'W' : 87,
		'Z' : 90,
		'up' : 38,
		'down' : 40,
		'left' : 37,
		'right' : 39
	};
	// Same for modes
	var m = { 'DEFAULT' : 0, 'POWER' : 1, 'ROTATE' : 2, 'CLAMP' : 3, 'INIT' : -1};

	// Keys action and status definition
	var key = {};
	key[k.esc] = { 		action : false, 		pressed : false };
	key[k.del] = { 		action : false, 		pressed : false };
	key[k.alt] = { 		action : false, 		pressed : false };
	key[k.A] = { 		action : 'turnLeft', 	pressed : false };
	key[k.D] = { 		action : 'turnRight', 	pressed : false };
	key[k.E] = { 		action : 'clampOpen', 	pressed : false };
	key[k.F] = { 		action : 'clampClose',	pressed : false };
	key[k.I] = { 		action : false, 		pressed : false };
	key[k.O] = { 		action : false, 		pressed : false };
	key[k.P] = { 		action : false, 		pressed : false };
	key[k.Q] = { 		action : 'turnLeft', 	pressed : false };
	key[k.R] = { 		action : false, 		pressed : false };
	key[k.S] = { 		action : 'backward', 	pressed : false };
	key[k.U] = { 		action : false, 		pressed : false };
	key[k.W] = { 		action : 'forward', 	pressed : false };
	key[k.Z] = { 		action : 'forward', 	pressed : false };
	key[k.up] = { 		action : 'clampUp', 	pressed : false };
	key[k.down] = { 	action : 'clampDown', 	pressed : false };
	key[k.left] = { 	action : 'clampClose',	pressed : false };
	key[k.right] = { 	action : 'clampOpen', 	pressed : false };

	// Set vars and init values
	var controlMode = m.INIT;

	// Init control mode
	setMode(localStorage.getItem("controlmode"));

	// Update key status
	$(document).keydown(function(event) {

		// Check if we care about that key
		if(!(event.which in key)) {
			return;
		}

		// Check if the event has not already been sent
		if(key[event.which].pressed !== true)
		{
			// Update key status
			key[event.which].pressed = true;

			// Send control event
			if(key[event.which].action !== false)
			{
				window.robotik.io.emit('control', key[event.which]);
			}
		}

		// Custom key combination
		if(key[k.esc].pressed &&
			key[k.del].pressed &&
			key[k.alt].pressed &&
			key[k.R].pressed)
		{
			if (key[k.U].pressed) {
				setMode(m.DEFAULT);
			}
			else if (key[k.I].pressed) {
				setMode(m.POWER);
			}
			else if (key[k.O].pressed) {
				setMode(m.ROTATE);
			}
			else if (key[k.P].pressed) {
				setMode(m.CLAMP);
			}
		}
	});
	$(document).keyup(function(event) {
		// Check if we care about that key
		if(!(event.which in key)) {
			return;
		}

		// Check if the event has not already been sent
		if(key[event.which].pressed !== false)
		{
			// Update key status
			key[event.which].pressed = false;

			// Send control event
			if(key[event.which].action !== false)
			{
				window.robotik.io.emit('control', key[event.which]);
			}
		}
	});

	// Functions
	function setMode(mode)
	{
		// Ignore null mode (when localStorage is empty)
		if(mode === null)
		{
			return;
		}

		// Convert mode to int to match the switch
		mode = parseInt(mode, 10);

		// Dont lock the interface on init with default mode
		if(controlMode === m.INIT && mode === m.DEFAULT) {
			return;
		}

		// Lock the interface
		$('main').remove();
		$('header').remove();
		$('#panelLock').css('display', 'block');

		// Save mode
		controlMode = mode;
		localStorage.setItem('controlmode', mode);

		// Set instructions on screen and disable keys
		switch(mode)
		{
			case m.DEFAULT: {
				$('#panelLock h1').text('Normal');
				$('#panelLock span').html('Touches : <br/>' +
											'ZQSD (ou WASD) pour déplacer le robot<br/>' +
											'←→↑↓ pour monter ou ouvrir la pince<br/>' +
											'Vous pouvez actualiser la page');
				key[k.W].action = 'forward';
				key[k.Z].action = 'forward';
				key[k.S].action = 'backward';
				key[k.A].action = 'turnLeft';
				key[k.Q].action = 'turnLeft';
				key[k.D].action = 'turnRight';
				key[k.up].action = 'clampUp';
				key[k.down].action = 'clampDown';
				key[k.right].action = 'clampOpen';
				key[k.E].action = 'clampOpen';
				key[k.left].action = 'clampClose';
				key[k.F].action = 'clampClose';
				break;
			}
			case m.POWER: {
				$('#panelLock h1').text('Puissance');
				$('#panelLock span').html('Touches : <br/>' +
											'Z et S (ou W et S) pour avancer ou reculer le robot');
				key[k.W].action = 'forward';
				key[k.Z].action = 'forward';
				key[k.S].action = 'backward';
				key[k.A].action = false;
				key[k.Q].action = false;
				key[k.D].action = false;
				key[k.up].action = false;
				key[k.down].action = false;
				key[k.right].action = false;
				key[k.E].action = false;
				key[k.left].action = false;
				key[k.F].action = false;
				break;
			}
			case m.ROTATE: {
				$('#panelLock h1').text('Rotation');
				$('#panelLock span').html('Touches : <br/>' +
											'Q et D (ou A et D) pour tourner le robot');
				key[k.W].action = false;
				key[k.Z].action = false;
				key[k.S].action = false;
				key[k.A].action = 'turnLeft';
				key[k.Q].action = 'turnLeft';
				key[k.D].action = 'turnRight';
				key[k.up].action = false;
				key[k.down].action = false;
				key[k.right].action = false;
				key[k.E].action = false;
				key[k.left].action = false;
				key[k.F].action = false;
				break;
			}
			case m.CLAMP: {
				$('#panelLock h1').text('Pince');
				$('#panelLock span').html('Touches : <br/>' +
											'↑↓ pour monter et déscendre la pince<br/>' +
											'←→ pour fermer et ouvrir la pince<br/>');
				key[k.W].action = false;
				key[k.Z].action = false;
				key[k.S].action = false;
				key[k.A].action = false;
				key[k.Q].action = false;
				key[k.D].action = false;
				key[k.up].action = 'clampUp';
				key[k.down].action = 'clampDown';
				key[k.right].action = 'clampOpen';
				key[k.E].action = 'clampOpen';
				key[k.left].action = 'clampClose';
				key[k.F].action = 'clampClose';
				break;
			}
			default:
				$('#panelLock span').html('Mode demandé inconnu');
				console.log('Unknown mode');
		}
	}
}());