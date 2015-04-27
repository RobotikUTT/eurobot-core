(function () {
  'use strict';
  
  var map = $('#map');
  var mapElement = map[0];
  var context = mapElement.getContext('2d');

  var loadImage = function(mapData, callback) {
      var image = new Image();
      image.onload = function() {
          callback(mapData, image);
      };
      image.src = mapData.tileSet.image.source;
  };

  var drawMap = function(mapData, image) {
      mapElement.width = mapData.map.width*mapData.map.tileWidth;
      mapElement.height = mapData.map.height*mapData.map.tileHeight;
      map.width(1000);
      var t = 0;
      for(var h = 0;h < mapData.map.height;h++) {
          for(var w = 0;w < mapData.map.width;w++) {
              context.drawImage(image, mapData.tiles[t].id*mapData.map.tileWidth, 0, mapData.map.tileWidth, mapData.map.tileHeight, w*mapData.map.tileWidth, h*mapData.map.tileHeight, mapData.map.tileWidth, mapData.map.tileHeight);
              t++;
          }
      }
  };

  window.robotik.io.on('map', function (data) {
      loadImage(data, drawMap);
  });

}());
