(function () {
	'use strict';

	var key = {};
	var left = 0;
	var right = 0;
	var leftCoef = 1.3;

	setInterval(function() {
		if(!key.up && !key.down) {
			window.robotik.io.emit('stepStop', { motor : 'elev' } );
			console.log(key.up + ' ' + key.down)
		}
		// if(!key.left && !key.right) {
		// 	window.robotik.io.emit('stepStop', { motor : 'clamp' } );
		// }
		if(!key.z && !key.q && !key.s && !key.d) {
			window.robotik.io.emit('runMotor', { motor : 'left', pwm : 0 } );
			window.robotik.io.emit('runMotor', { motor : 'right', pwm : 0 } );
		}
	}, 500);

	$(document).keydown(function(event) {
		//filter textarea and input
		var emit = false;
		var tag = event.target.tagName.toLowerCase();
		if(tag != 'input' && tag != 'textarea') {
			// console.log("Key: " + event.which);
			switch(event.which)
			{
				case 90: // Z
					if(key.z !== true)
					{
						emit = true;
						key.z = true;
						left += Math.floor(100*leftCoef);
						right += 100;
						emit = true;
					}
					break;

				case 81: // Q
					if(key.q !== true)
					{
						emit = true;
						key.q = true;
						right += 80;
						left -= Math.floor(40*leftCoef);
					}
					break;

				case 83: // S
					if(key.s !== true)
					{
						emit = true;
						key.s = true;
						left -= Math.floor(100*leftCoef);
						right -= 100;
					}
					break;

				case 68: // D
					if(key.d !== true)
					{
						emit = true;
						key.d = true;
						left += Math.floor(80*leftCoef);
						right -= 40;
					}
					break;

				case 32: // Space
					if(key.space !== true)
					{
						emit = true;
						key.space = true;
						left = 0;
						right = 0;

						key.z = false;
						key.q = false;
						key.s = false;
						key.d = false;
						window.robotik.io.emit('stepStop', { motor : 'elev' } );
						window.robotik.io.emit('stepStop', { motor : 'clamp' } );
					}
					break;

				case 38: // Up
					if(key.up !== true)
					{
						key.up = true;
						window.robotik.io.emit('stepGoto', { motor : 'elev', pos : 10000000 } );
					}
					break;
				case 40: // Down
					if(key.down !== true)
					{
						key.down = true;
						window.robotik.io.emit('stepGoto', { motor : 'elev', pos : -10000000 } );
					}
					break;
				case 37: // Left
					if(key.left !== true)
					{
						key.left = true;
						window.robotik.io.emit('stepGoto', { motor : 'clamp', pos : 10000000 } );
					}
					break;
				case 39: // Right
					if(key.right !== true)
					{
						key.right = true;
						window.robotik.io.emit('stepGoto', { motor : 'clamp', pos : -10000000 } );
					}
					break;
				// case 170: // *
				// 	if(key.star !== true)
				// 	{
				// 		key.star = true;
				// 		window.robotik.io.emit('stepInit', { motor : 'elev' } );
				// 	}
				// 	break;
				// case 165: // ù
				// 	if(key.ugrave !== true)
				// 	{
				// 		key.ugrave = true;
				// 		window.robotik.io.emit('stepInit', { motor : 'clamp' } );
				// 	}
				// 	break;
			}

			if(emit == true)
			{
				window.robotik.io.emit('runMotor', { motor : 'left', pwm : left } );
				window.robotik.io.emit('runMotor', { motor : 'right', pwm : right } );
				emit = false;
			}
		}
	});


	$(document).keyup(function(event) {
		var emit = false;
		//filter textarea and input
		var tag = event.target.tagName.toLowerCase();
		if(tag != 'input' && tag != 'textarea') {
			switch(event.which)
			{
				case 90: // Z
					if(key.z === true)
					{
						emit = true;
						key.z = false;
						left -= Math.ceil(100*leftCoef);
						right -= 100;
					}
					break;

				case 81: // Q
					if(key.q === true)
					{
						emit = true;
						key.q = false;
						right -= 80;
						left += Math.ceil(40*leftCoef);
					}
					break;

				case 83: // S
					if(key.s === true)
					{
						emit = true;
						key.s = false;
						left += Math.ceil(100*leftCoef);
						right += 100;
					}
					break;

				case 68: // D
					if(key.d === true)
					{
						emit = true;
						key.d = false;
						left -= Math.ceil(80*leftCoef);
						right += 40;
					}
					break;

				case 32: // Space
					if(key.space === true)
					{
						key.space = false;
					}
					break;


				case 38: // Up
					if(key.up === true)
					{
						key.up = false;
						window.robotik.io.emit('stepStop', { motor : 'elev' } );
					}
					break;
				case 40: // Down
					if(key.down === true)
					{
						key.down = false;
						window.robotik.io.emit('stepStop', { motor : 'elev' } );
					}
					break;
				case 37: // Left
					if(key.left === true)
					{
						key.left = false;
						window.robotik.io.emit('stepStop', { motor : 'clamp' } );
					}
					break;
				case 39: // Right
					if(key.right === true)
					{
						key.right = false;
						window.robotik.io.emit('stepStop', { motor : 'clamp' } );
					}
					break;
				// case 170: // *
				// 	if(key.star === true)
				// 	{
				// 		key.star = false;
				// 	}
				// 	break;
				// case 165: // ù
				// 	if(key.ugrave === true)
				// 	{
				// 		key.ugrave = false;
				// 	}
				// 	break;
			}

			if(emit == true)
			{
				window.robotik.io.emit('runMotor', { motor : 'left', pwm : left } );
				window.robotik.io.emit('runMotor', { motor : 'right', pwm : right } );
				emit = false;
			}
		}
	});

}());