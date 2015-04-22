(function () {
  'use strict';

  window.robotik.chartPoints = [
    [1, 10, 'S1'],
    [2, 14, 'S1'],
    [1, 4,  'S2'],
    [2, 20, 'S2']
  ];

  window.robotik.chart = function () {
    var points = window.robotik.chartPoints;

    // Organize by series
    var tempValues = {};
    var labels = [];
    var values = [];

    window.robotik.chartPoints.forEach(function (point) {
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

    $('#chart').highcharts({
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
        series: values
    });

    $(window).resize();
  };

  function unique (array) {
    return array.filter(function (el, index) {
      return index == array.indexOf(el);
    });
  }

}());
