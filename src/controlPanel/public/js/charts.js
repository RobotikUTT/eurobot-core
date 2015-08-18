var MotionChart = function($container) {
    this.$container = $container;
    this.series = [{ data: [] }, { data: [] }];
    this.data = { position: [], velocity: [] };
    this.$plot = null;
    this.initialized = false;
    this.refreshPeriod = 100; //ms

    var that = this;

    this.render = function() {
        if (!this.$plot)
            return

        this.series[0].data = [];
        this.series[1].data = [];
        for (var i = 0; i < this.maximum; ++i)
        {
            this.series[0].data.push([i, this.data.position[i]]);
            this.series[1].data.push([i, this.data.velocity[i]]);
        }

        this.$plot.setData(this.series);
        this.$plot.draw();
    }

    this.init = function() {
        // High res plot while avoiding more than one point per pixel
        this.maximum = $container.outerWidth() / 2;
        // However, 3000 point min
        // this.maximum = (this.maximum > 3000) ? this.maximum : 3000;

        if (!this.initialized) {
            // Init data
            for (var i = 0; i < this.maximum; i++)
            {
                this.data.position[i] = 0;
                this.data.velocity[i] = 0;
            }
            this.initialized = true;
        }

        this.$plot =  $.plot(this.$container, this.series, {
        grid: {
            borderWidth: 1,
            minBorderMargin: 20,
            labelMargin: 10,
            backgroundColor: {
                colors: ["#fff", "#e4f4f4"]
            },
            margin: {
                top: 8,
                bottom: 20,
                left: 20
            },
            markings: function(axes) {
                var markings = [];
                var xaxis = axes.xaxis;
                for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                    markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: "rgba(232, 232, 255, 0.2)" });
                }
                return markings;
            }
        },
        xaxis: {
            min: 0,
            max: that.maximum,
            tickFormatter: function() {
                return "";
            }
        },
        yaxis: {
            min: 0,
            max: 1
        },
        legend: {
            show: true
        }
    });
        this.render();

    }

    this.addPoints = function(newData) {
        if (!this.$plot)
            return

        this.data.position = this.data.position.slice(1);
        this.data.position.push(newData.position);
        this.data.velocity.push(newData.velocity);
        this.data.velocity = this.data.velocity.slice(1);
    }

    this.resize = function() {
        this.$container.width(this.$container.parent().width());
        this.$container.height($(window).height()/2);
        this.init();
    }

    setInterval(function() {
        that.render();
    }, that.refreshPeriod);
};


$(function() {
    window.charts = {};

    charts.distanceChart = new MotionChart($('#distanceChart'));
    charts.orientationChart = new MotionChart($('#orientationChart'));

    $(window).on('resize', function() {
        console.log('ici');
        charts.distanceChart.resize();
        charts.orientationChart.resize();
    });
});