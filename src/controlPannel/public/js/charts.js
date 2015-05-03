(function () {
  'use strict';

  window.robotik.chartPoints = [
    [
      [0, 0, 'Orientation']
    ],
    [
      [0, 0, 'Distance parcourue']
    ]
  ];

  window.robotik.highcharts = [];

  var $jqEmitter = $({});
  $jqEmitter.data('paused', false);

  window.robotik.chart = function () {
    window.robotik.highcharts = [];

    var points = window.robotik.chartPoints;

    window.robotik.chartPoints.forEach(function (graph, graphN) {
      graph.forEach(function (point) {
        // Organize by series
        var tempValues = {};
        var labels = [];
        var values = [];

        if (!tempValues[point[2]]) {
          tempValues[point[2]] = {
            name: point[2],
            data: []
          };
        }

        labels.push(point[0]);
        tempValues[point[2]].data.push(point[1]);

        Object.keys(tempValues).forEach(function (tempValue) {
          values.push(tempValues[tempValue]);
        });

        console.log(values);

        window.robotik.highcharts.push($('#chart' + graphN).highcharts({
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
                },
                animation: false
              },
              animation: false
            },
            series: values,
            chart: {
              events: {
                load: function () {
                  var self = this;

                  $jqEmitter.on('resetPoints', function () {
                    self.series[0].setData([], true);
                  });
                }
              },
              animation: false
            }
        }));
        window.robotik.highcharts[window.robotik.highcharts.length - 1].i = 0;
      });
    });

    $(window).resize();
  };

  $('#resetContainer a').click(function () {
    $jqEmitter.trigger('resetPoints');
  });

  $('#pauseContainer a').click(function () {
    $jqEmitter.data('paused', !$jqEmitter.data('paused'));

    window.robotik.isPaused = $jqEmitter.data('paused');

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
