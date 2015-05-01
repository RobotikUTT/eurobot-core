(function () {
  'use strict';

  window.robotik.chartPoints = [
    [
      [0, 0, 'Orientation']
    ],
  ];

  var $jqEmitter = $({});

  window.robotik.chart = function () {
    var points = window.robotik.chartPoints;

    // Organize by series
    var tempValues = {};
    var labels = [];
    var values = [];

    window.robotik.chartPoints.forEach(function (graph, graphN) {
      graph.forEach(function (point) {
        if (!tempValues[point[2]]) {
          tempValues[point[2]] = {
            name: point[2],
            data: []
          };
        }

        labels.push(point[0]);
        tempValues[point[2]].data.push(point[1]);
      });

      Object.keys(tempValues).forEach(function (tempValue) {
        values.push(tempValues[tempValue]);
      });

      var data = {
        labels: unique(labels),
        datasets: values
      };

      $('#chart' + graphN).highcharts({
          title: { text: '' },
          xAxis: {
            categories: labels
          },
          yAxis: {
              title: {
                  text: ''
              },
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
          },
          series: values,
          chart: {
            events: {
              load: function () {
                var self = this;

                console.log('call');
                // Initial amount of points
                var i = this.series[0].data.length;
                console.dir(self.series[0]);
                robotik.io.on('getPosition', function (status) {
                  var value = parseFloat(status.orientation) * 57.2957795;
                  self.series[0].addPoint([i, value], true, false);
                  ++i;

                  if (i === 10000) {
                    $jqEmitter.trigger('resetPoints');
                  }
                });

                $jqEmitter.on('resetPoints', function () {
                  i = 0;
                  self.series[0].setData([], true);
                });
              }
            }
          }
      });
    });

    $(window).resize();
  };

  $('#resetContainer').click(function () {
    $jqEmitter.trigger('resetPoints');
  });

  function unique (array) {
    return array.filter(function (el, index) {
      return index == array.indexOf(el);
    });
  }

}());
