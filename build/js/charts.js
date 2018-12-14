window.onload = () => {


        const data = [
                { name: 'Brain', id: 1, quantity: 86, percentage: 5 },
                { name: 'Colon', id: 2, quantity: 300, percentage: 18 },
                { name: 'Kidney', id: 3, quantity: 276, percentage: 16 },
                { name: 'Lung', id: 4, quantity: 195, percentage: 11 },
                { name: 'Stomach', id: 5, quantity: 36, percentage: 2 },
                { name: 'Other', id: 0, quantity: 814, percentage: 48 }
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
        let donutChart = britecharts.donut();

        donutChart
            .width(400)
            .height(300);
            
        donutChart.colorSchema(['#F44335','#795548','#673AB7','#4B74FF','#FF9801','#CDDC39'])
        d3.select('.js-donut-container').datum(data).call(donutChart);

        // legendChart.
        // width(300).
        // height(200).
        // numberFormat('s');
      
        // donutContainer.datum(donutData.data).call(donutChart);
        // // legendContainer = d3.select('.js-legend-chart-container');
        // legendContainer.datum(donutData.data).call(legendChart);

        }

        createHorizontalBarChart();
        createDonutChart();

        let barData = {
                data:[
                    {name: "Brain", value: 0.08167},
                    {name: "Colon", value: 0.01492},
                    {name: "Kidney", value: 0.02782},
                    {name: "Lung", value: 0.04253},
                    {name: "Ovary", value: 0.12702},
                    {name: "Prostate", value: 0.02288},
                    {name: "Stomach", value: 0.02015},
                    {name: "Heart", value: 0.06094},
                    {name: "Pancreas", value: 0.06966},
                    {name: "Liver", value: 0.00153},
                    {name: "Trachea", value: 0.00772},
                    {name: "Appendix", value: 0.04025},
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
        window.onload = () => { createSimpleBarChart() }
            
        let stackedBarData = {
        data:[
            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Brain"},
            {stack: "AACCTT", name: "AACCTT", value: 20, tissue: "Brain"},
            {stack: "AATTCC", name: "AATTCC", value: 10, tissue: "Brain"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Brain"},
            {stack: "CCTTGG", name: "CCTTGG", value: 10, tissue: "Brain"},

            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Colon"},
            {stack: "AACCTT", name: "AACCTT", value: 10, tissue: "Colon"},
            {stack: "AATTCC", name: "AATTCC", value: 30, tissue: "Colon"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Colon"},
            {stack: "CCTTGG", name: "CCTTGG", value: 20, tissue: "Colon"},

            {stack: "AACCGG", name: "AACCGG", value: 20, tissue: "Kidney"},
            {stack: "AACCTT", name: "AACCTT", value: 20, tissue: "Kidney"},
            {stack: "AATTCC", name: "AATTCC", value: 10, tissue: "Kidney"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Kidney"},
            {stack: "CCTTGG", name: "CCTTGG", value: 30, tissue: "Kidney"},

            {stack: "AACCGG", name: "AACCGG", value: 15, tissue: "Lung"},
            {stack: "AACCTT", name: "AACCTT", value: 10, tissue: "Lung"},
            {stack: "AATTCC", name: "AATTCC", value: 10, tissue: "Lung"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Lung"},
            {stack: "CCTTGG", name: "CCTTGG", value: 15, tissue: "Lung"},

            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Prostate"},
            {stack: "AACCTT", name: "AACCTT", value: 10, tissue: "Prostate"},
            {stack: "AATTCC", name: "AATTCC", value: 5, tissue: "Prostate"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Prostate"},
            {stack: "CCTTGG", name: "CCTTGG", value: 10, tissue: "Prostate"},

            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Stomach"},
            {stack: "AACCTT", name: "AACCTT", value: 10, tissue: "Stomach"},
            {stack: "AATTCC", name: "AATTCC", value: 20, tissue: "Stomach"},
            {stack: "AATTGG", name: "AATTGG", value: 20, tissue: "Stomach"},
            {stack: "CCTTGG", name: "CCTTGG", value: 10, tissue: "Stomach"},

            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Heart"},
            {stack: "AACCTT", name: "AACCTT", value: 20, tissue: "Heart"},
            {stack: "AATTCC", name: "AATTCC", value: 10, tissue: "Heart"},
            {stack: "CCTTGG", name: "CCTTGG", value: 10, tissue: "Heart"},


            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Pancreas"},
            {stack: "AACCTT", name: "AACCTT", value: 10, tissue: "Pancreas"},
            {stack: "AATTCC", name: "AATTCC", value: 20, tissue: "Pancreas"},
            {stack: "AATTGG", name: "AATTGG", value: 20, tissue: "Pancreas"},
            {stack: "CCTTGG", name: "CCTTGG", value: 10, tissue: "Pancreas"},



            {stack: "AACCGG", name: "AACCGG", value: 5, tissue: "Liver"},
            {stack: "AACCTT", name: "AACCTT", value: 20, tissue: "Liver"},
            {stack: "AATTGG", name: "AATTGG", value: 15, tissue: "Liver"},
            {stack: "CCTTGG", name: "CCTTGG", value: 15, tissue: "Liver"},


            {stack: "AACCGG", name: "AACCGG", value: 10, tissue: "Trachea"},
            {stack: "AACCTT", name: "AACCTT", value: 20, tissue: "Trachea"},
            {stack: "AATTCC", name: "AATTCC", value: 10, tissue: "Trachea"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Trachea"},

            {stack: "AACCGG", name: "AACCGG", value: 20, tissue: "Appendix"},
            {stack: "AACCTT", name: "AACCTT", value: 10, tissue: "Appendix"},
            {stack: "AATTCC", name: "AATTCC", value: 30, tissue: "Appendix"},
            {stack: "AATTGG", name: "AATTGG", value: 10, tissue: "Appendix"},
            {stack: "CCTTGG", name: "CCTTGG", value: 20, tissue: "Appendix"},



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
                  .nameLabel('stack')
                  .title('Tissues')
                //   .title('');
              
                tooltipContainer = d3.select('.js-stacked-bar-chart-tooltip-container .metadata-group');
                tooltipContainer.datum([]).call(chartTooltip);


        // stackedBarChart
        // .tooltipThreshold(600)
        // .width(containerWidth)
        // .grid('horizontal')
        // .isAnimated(true)
        // .stackLabel('stack')
        // .nameLabel('tissue')
        // .valueLabel('value')
        // .on('customMouseOver', function() {
        //     chartTooltip.show();

        // })
        // .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
        //     chartTooltip.uptissue(dataPoint, topicColorMap, x, y);
        // })
        // .on('customMouseOut', function() {
        //     chartTooltip.hide();
        // });
        // stackedBarChart.colorSchema(['#795548','#FF9801','#CDDC39','#2096F3','#673AB7','#4B74FF'])
        // container.datum(stackedBarData.data).call(stackedBarChart);

        // chartTooltip
        //     .topicLabel('tissue')
        //     .tissueLabel('key')
        //     .nameLabel('stack')

        // tooltipContainer = d3.select('.js-stacked-bar-chart-tooltip-container .metadata-group');
        // tooltipContainer.datum([]).call(chartTooltip);

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
