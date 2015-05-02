(function () {
  'use strict';

  window.robotik.chartPoints = [
    [
      [0, 0, 'Orientation']
    ],
  ];

  var highcharts = [];

  var $jqEmitter = $({});
  $jqEmitter.data('paused', false);

  window.robotik.chart = function () {
    highcharts = [];

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

      highcharts.push($('#chart' + graphN).highcharts({
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
          tooltip: {
            formatter: function () {
              if ($jqEmitter.data('paused')) {
                return '[ <b>' + this.x + '</b> ; <b>' + this.y + '</b> ]';
              } else {
                return false;
              }
            }
          },
          plotOptions: {
            series: {
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false
                  }
                }
              }
            }
          },
          series: values,
          chart: {
            events: {
              load: function () {
                var self = this;

                // Initial amount of points
                var i = this.series[0].data.length;
                console.dir(self.series[0]);
                robotik.io.on('getPosition', function (status) {
                  var value = parseFloat(status.orientation) * 57.2957795;

                  if (!$jqEmitter.data('paused')) {
                    self.series[0].addPoint([i, value], true, i > 100);
                    ++i;
                  }
                });

                $jqEmitter.on('resetPoints', function () {
                  i = 0;
                  self.series[0].setData([], true);
                });
              }
            }
          }
      }));
    });

    $(window).resize();
  };

  $('#resetContainer a').click(function () {
    $jqEmitter.trigger('resetPoints');
  });

  $('#pauseContainer a').click(function () {
    $jqEmitter.data('paused', !$jqEmitter.data('paused'));

    var $self = $(this);
    if ($jqEmitter.data('paused')) {
      $self.text('Reprise graphiques');
    } else {
      $self.text('Pause graphiques');
    }
  });

  function unique (array) {
    return array.filter(function (el, index) {
      return index == array.indexOf(el);
    });
  }

}());
