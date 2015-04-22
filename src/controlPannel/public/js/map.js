(function () {
  'use strict';

  var $map = $('#map');
  var ctx  = $map[0].getContext('2d');

  window.robotik.mapPoints = [
    [10, 10, 'red', 4],
    [10, 14, null, 4],
    [10, 15],
    [10, 16],
    [10, 17],
    [10, 18],
    [10, 19],
    [10, 20]
  ];

  window.robotik.map = function () {
    var points = window.robotik.mapPoints;
    for (var i = points.length - 1; i >= 0; i--) {
      var size = (points[i].length >= 4 && points[i][3]) ? points[i][3] : 1;
      ctx.fillStyle = (points[i].length >= 3 && points[i][2]) ? points[i][2] : 'black';

      console.log('drawing', points[i][0], points[i][1], size, size);
      ctx.fillRect(points[i][0], points[i][1], size, size);
    }
  };

}());
