(function () {
	'use strict';

	var key = {};
	var left = 0;
	var right = 0;
	var leftCoef = 1.3;
	var controlMode = 'init';


	function setMode(mode)
	{
		if(mode === 'normal')
		{
			if(controlMode !== 'init')
			{
				document.body.innerHTML = '<h1>Normal (Actualisez la page)</h1>'
											+ '<i style="font-size:2em;">Touches : ZQSD + Flèches</i><br/>'
											+ '<img src="images/robotik.jpg">';
				document.body.style.textAlign = 'center';
				document.body.style.color = 'gray';
			}
			controlMode = mode;
			localStorage.setItem('controlmode', mode);
		}
		else if(mode === 'power')
		{
			document.body.innerHTML = '<h1>Puissance</h1>'
											+ '<i style="font-size:2em;">Touches : Z et Q</i><br/>'
											+ '<img src="images/robotik.jpg">';
			document.body.style.textAlign = 'center';
			document.body.style.color = 'gray';
			controlMode = mode;
			localStorage.setItem('controlmode', mode);
		}
		else if(mode === 'rotation')
		{
			document.body.innerHTML = '<h1>Rotation</h1>'
											+ '<i style="font-size:2em;">Touches : Q et D</i><br/>'
											+ '<img src="images/robotik.jpg">';
			document.body.style.textAlign = 'center';
			document.body.style.color = 'gray';
			controlMode = mode;
			localStorage.setItem('controlmode', mode);
		}
		else if(mode === 'clamp')
		{
			document.body.innerHTML = '<h1>Pince</h1>'
											+ '<i style="font-size:2em;">Touches :</i><br/>'
											+ '<i style="font-size:2em;">↑↓ pour monter et déscendre</i><br/>'
											+ '<i style="font-size:2em;">←→ pour fermer et ouvrir</i><br/>'
											+ '<img src="images/robotik.jpg">';
			document.body.style.textAlign = 'center';
			document.body.style.color = 'gray';
			controlMode = mode;
			localStorage.setItem('controlmode', mode);
		}
	}
	setMode(localStorage.getItem("controlmode"));

	$(document).keydown(function(event) {
		//filter textarea and input
		var emit = false;
		var tag = event.target.tagName.toLowerCase();
		if(tag != 'input' && tag != 'textarea') {
			// console.log("Key: " + event.which);
			switch(event.which)
			{
				case 90: // Z
					if(key.z !== true && (controlMode === 'normal' || controlMode === 'power'))
					{
						emit = true;
						key.z = true;
						left += Math.floor(100*leftCoef);
						right += 100;
						emit = true;
					}
					break;

				case 81: // Q
					if(key.q !== true && (controlMode === 'normal' || controlMode === 'rotation'))
					{
						emit = true;
						key.q = true;
						right += 80;
						left -= Math.floor(60*leftCoef);
					}
					break;

				case 83: // S
					if(key.s !== true && (controlMode === 'normal' || controlMode === 'power'))
					{
						emit = true;
						key.s = true;
						left -= Math.floor(100*leftCoef);
						right -= 100;
					}
					break;

				case 68: // D
					if(key.d !== true && (controlMode === 'normal' || controlMode === 'rotation'))
					{
						emit = true;
						key.d = true;
						left += Math.floor(80*leftCoef);
						right -= 60;
					}
					break;

				case 32: // Space
					if(key.space !== true && controlMode === 'normal')
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
					if(key.up !== true && (controlMode === 'normal' || controlMode === 'clamp'))
					{
						key.up = true;
						window.robotik.io.emit('stepGoto', { motor : 'elev', pos : 10000000 } );
					}
					break;
				case 40: // Down
					if(key.down !== true && (controlMode === 'normal' || controlMode === 'clamp'))
					{
						key.down = true;
						window.robotik.io.emit('stepGoto', { motor : 'elev', pos : -10000000 } );
					}
					break;
				case 37: // Left
					if(key.left !== true && (controlMode === 'normal' || controlMode === 'clamp'))
					{
						key.left = true;
						window.robotik.io.emit('stepGoto', { motor : 'clamp', pos : 10000000 } );
					}
					break;
				case 39: // Right
					if(key.right !== true && (controlMode === 'normal' || controlMode === 'clamp'))
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
				//

				case 88: //x
					key.x = true;
					break;
				case 176: //²
				case 192: //²
					key.square = true;
					break;
				case 187: //=
				case 61: //=
					key.eq = true;
					break;
				case 85: //u
					key.u = true;
					break;
				case 73: //i
					key.i = true;
					break;
				case 79: //o
					key.o = true;
					break;
				case 80: //p
					key.p = true;
					break;
			}

			if(emit === true)
			{
				window.robotik.io.emit('runMotor', { motor : 'left', pwm : left } );
				window.robotik.io.emit('runMotor', { motor : 'right', pwm : right } );
				emit = false;
			}

			// Manual control only mode
			if(key.x === true && key.square === true && key.eq === true)
			{
				//Remove everithing on the screen and put a Robotik Logo
   				if(key.u === true)
   				{
   					setMode('normal');
   				}
   				else if(key.i === true)
   				{
   					setMode('power');
   				}
   				else if(key.o === true)
   				{
   					setMode('rotation');
   				}
   				else if(key.p === true)
   				{
   					setMode('clamp');
   				}

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
						left += Math.ceil(60*leftCoef);
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
						right += 60;
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
				//

				case 88: //x
					key.x = false;
					break;
				case 176: //²
				case 192: //²
					key.square = false;
					break;
				case 187: //=
				case 61: //=
					key.eq = false;
					break;
				case 85: //u
					key.u = false;
					break;
				case 73: //i
					key.i = false;
					break;
				case 79: //o
					key.o = false;
					break;
				case 80: //p
					key.p = false;
					break;
			}

			if(emit === true)
			{
				window.robotik.io.emit('runMotor', { motor : 'left', pwm : left } );
				window.robotik.io.emit('runMotor', { motor : 'right', pwm : right } );
				emit = false;
			}
		}
	});

}());