window.onload = () => {

    

        const data = [
                { name: 'ATGGC', id: 1, quantity: 10.1857, percentage: 5 },
                { name: 'GATCTAG', id: 2, quantity: 8.86419, percentage: 18 },
                { name: 'TGGCG', id: 3, quantity: 7.83511, percentage: 16 },
                { name: 'AACCCTAG', id: 4, quantity: 7.43958, percentage: 11 },
                { name: '[AG]G[GC]CCA', id: 5, quantity: 6.13881, percentage: 2 },
                { name: 'TGCAA', id: 6, quantity: 10.1857, percentage: 5 },
                { name: 'TGGAC', id: 7, quantity: 8.86419, percentage: 18 },
                { name: 'TAGAC', id: 8, quantity: 7.83511, percentage: 16 },
                { name: 'TGGGG', id: 9, quantity: 7.43958, percentage: 11 },
                { name: 'TTGAC', id: 10, quantity: 6.13881, percentage: 2 },



            ];

        function createHorizontalBarChart() {
            let barChart = britecharts.bar(),
                margin = {
                        left: 120,
                        right: 20,
                        top: 20,
                        bottom: 30
                },
                barContainer = d3.select('.js-bar-container'),
                containerWidth = barContainer.node() ? barContainer.node().getBoundingClientRect().width : false;

            barChart
                .isHorizontal(true)
                .margin(margin)
                .width(containerWidth)
                .colorSchema(['#4B74FF'])
                .valueLabel('percentage')
                .height(300);

            barContainer.datum(data).call(barChart);
        }


       



          function createDonutChart() {
            var donutChart = britecharts.donut(),
            donutContainer = d3.select('.js-donut-chart-container'),
            containerWidth = donutContainer.node() ? donutContainer.node().getBoundingClientRect().width : false,
            legendChart = britecharts.legend(),
            legendContainer = void 0;

            donutChart.
            isAnimated(true).
            highlightSliceById(2).
            width(containerWidth).
            height(containerWidth).
            colorSchema(['#F44335','#795548','#673AB7','#4B74FF','#FF9801','#CDDC39']).
            externalRadius(containerWidth / 2.5).
            internalRadius(containerWidth / 5).
            on('customMouseOver', function (data) {
              legendChart.highlight(data.data.id);
            }).
            on('customMouseOut', function () {
              legendChart.clearHighlight();
            });

            legendChart.
            width(300).
            height(200).

            colorSchema(['#F44335','#795548','#673AB7','#4B74FF','#FF9801','#CDDC39']).
            numberFormat('s');

            donutContainer.datum(data).call(donutChart);
            donutChart.colorSchema(['#F44335','#795548','#673AB7','#4B74FF','#FF9801','#CDDC39'])
            legendContainer = d3.select('.js-legend-chart-container');
            legendContainer.datum(data).call(legendChart);

          }


        createHorizontalBarChart();
        createDonutChart();

        let barData = {
                data:[
                    {name: "ATGGC", value: 10.1857,},
                    {name: "GATCTAG", value: 8.86419},
                    {name: "AACCCTAG", value: 7.83511},
                    {name: "[AG]G[GC]CCA", value: 7.43958},
                    {name: "TGCAA", value: 6.13881},
                    {name: "TGCAA", value: 9.1857,},
                    {name: "TGGAC", value: 8.86419},
                    {name: "TAGAC", value: 7.83511},
                    {name: "TGGGG", value: 7.43958},
                    {name: "TTGAC", value: 6.13881},

                ]
                };



        
        function createSimpleBarChart() {
        let barChart = britecharts.bar(),
            barContainer = d3.select('.js-bar-chart-container'),
            containerWidth = barContainer.node() ? barContainer.node().getBoundingClientRect().width : false,
            dataset;


        if (containerWidth) {
            dataset = barData.data;


            barChart
            .width(containerWidth)
            // .xAxisLabel('X Axis Label')
            // .yAxisLabel('Y Axis Label')
            .height(300);
            
            barChart.colorSchema(['#4B74FF'])
            barContainer.datum(dataset).call(barChart);
        };
        };
        createSimpleBarChart();
        // window.onload = () => { createSimpleBarChart() }



            
        let stackedBarData = {
        data:[
            {stack: "Cluster 1", name: "TATAA", value: 10, tissue: "Cluster 1"},
            {stack: "Cluster 1", name: "TATAT", value: 20, tissue: "Cluster 1"},
            {stack: "Cluster 1", name: "TATAT", value: 10, tissue: "Cluster 1"},
            {stack: "Cluster 1", name: "TATAA", value: 10, tissue: "Cluster 1"},
            {stack: "Cluster 1", name: "ATAAA", value: 10, tissue: "Cluster 1"},

            {stack: "Cluster 2", name: "AACCGG", value: 10, tissue: "Cluster 2"},
            {stack: "Cluster 2", name: "AACCTT", value: 10, tissue: "Cluster 2"},
            {stack: "Cluster 2", name: "AATTCC", value: 30, tissue: "Cluster 2"},
            {stack: "Cluster 2", name: "AATTGG", value: 10, tissue: "Cluster 2"},
            {stack: "Cluster 2", name: "CCTTGG", value: 20, tissue: "Cluster 2"},

            {stack: "Cluster 3", name: "AACCGG", value: 20, tissue: "Cluster 3"},
            {stack: "Cluster 3", name: "AACCTT", value: 20, tissue: "Cluster 3"},
            {stack: "Cluster 3", name: "AATTCC", value: 10, tissue: "Cluster 3"},
            {stack: "Cluster 3", name: "AATTGG", value: 10, tissue: "Cluster 3"},
            {stack: "Cluster 3", name: "CCTTGG", value: 30, tissue: "Cluster 3"},

            {stack: "Cluster 4", name: "AACCGG", value: 15, tissue: "Cluster 4"},
            {stack: "Cluster 4", name: "AACCTT", value: 10, tissue: "Cluster 4"},
            {stack: "Cluster 4", name: "AATTCC", value: 10, tissue: "Cluster 4"},
            {stack: "Cluster 4", name: "AATTGG", value: 10, tissue: "Cluster 4"},
            {stack: "Cluster 4", name: "CCTTGG", value: 15, tissue: "Cluster 4"},

            {stack: "Cluster 5", name: "AACCGG", value: 10, tissue: "Cluster 5"},
            {stack: "Cluster 5", name: "AACCTT", value: 10, tissue: "Cluster 5"},
            {stack: "Cluster 5", name: "AATTCC", value: 5, tissue: "Cluster 5"},
            {stack: "Cluster 5", name: "AATTGG", value: 10, tissue: "Cluster 5"},
            {stack: "Cluster 5", name: "CCTTGG", value: 10, tissue: "Cluster 5"},




        ]
        };


        

var stackedBarChart = new britecharts.stackedBar(),
chartTooltip = britecharts.tooltip(),
container = d3.select('.js-stacked-bar-chart-tooltip-container'),
containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
tooltipContainer;

    stackedBarChart
        .tooltipThreshold(600)
        .width(containerWidth)
        .grid('horizontal')
        .isAnimated(true)
        .stackLabel('stack')
        .nameLabel('name')
        .nameLabel('tissue')
        .valueLabel('value')
        .on('customMouseOver', function() {
            chartTooltip.show();
        })
        .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
            chartTooltip.update(dataPoint, topicColorMap, x, y);
        })
        .on('customMouseOut', function() {
            chartTooltip.hide();
        });
        
        stackedBarChart.colorSchema(['#795548','#FF9801','#CDDC39','#2096F3','#673AB7','#4B74FF'])
        container.datum(stackedBarData.data).call(stackedBarChart);
        
        chartTooltip
            .topicLabel('values')
            .dateLabel('tissues')
        //   .stackLabel('names')
            .nameLabel('name')
            .title('Clusters')
        //   .title('');
        
        tooltipContainer = d3.select('.js-stacked-bar-chart-tooltip-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);


createHorizontalStackedBarChart();

(function() {
    var parent = document.querySelector(".range-slider");
    if (!parent) return;

    var rangeS = parent.querySelectorAll("input[type=range]"),
            numberS = parent.querySelectorAll("input[type=number]");

    rangeS.forEach(function(el) {
        el.oninput = function() {
            var slide1 = parseFloat(rangeS[0].value),
                    slide2 = parseFloat(rangeS[1].value);

            if (slide1 > slide2) {
                [slide1, slide2] = [slide2, slide1];
                // var tmp = slide2;
                // slide2 = slide1;
                // slide1 = tmp;
            }

            numberS[0].value = slide1;
            numberS[1].value = slide2;
        };
    });

    numberS.forEach(function(el) {
        el.oninput = function() {
            var number1 = parseFloat(numberS[0].value),
                    number2 = parseFloat(numberS[1].value);

            if (number1 > number2) {
                var tmp = number1;
                numberS[0].value = number2;
                numberS[1].value = tmp;
            }

            rangeS[0].value = number1;
            rangeS[1].value = number2;
        };
    });
})();


          





        
}       
