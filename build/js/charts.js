

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
    
let stackedBarData = {
data:[
    {stack: "color1", name: "AACCGG", value: 10, tissue: "Brain"},
    {stack: "color2", name: "AACCTT", value: 20, tissue: "Brain"},
    {stack: "color3", name: "AATTCC", value: 10, tissue: "Brain"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Brain"},
    {stack: "color5", name: "CCTTGG", value: 10, tissue: "Brain"},

    {stack: "color1", name: "AACCGG", value: 10, tissue: "Colon"},
    {stack: "color2", name: "AACCTT", value: 10, tissue: "Colon"},
    {stack: "color3", name: "AATTCC", value: 30, tissue: "Colon"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Colon"},
    {stack: "color5", name: "CCTTGG", value: 20, tissue: "Colon"},

    {stack: "color1", name: "AACCGG", value: 20, tissue: "Kidney"},
    {stack: "color2", name: "AACCTT", value: 20, tissue: "Kidney"},
    {stack: "color3", name: "AATTCC", value: 10, tissue: "Kidney"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Kidney"},
    {stack: "color5", name: "CCTTGG", value: 30, tissue: "Kidney"},

    {stack: "color1", name: "AACCGG", value: 15, tissue: "Lung"},
    {stack: "color2", name: "AACCTT", value: 10, tissue: "Lung"},
    {stack: "color3", name: "AATTCC", value: 10, tissue: "Lung"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Lung"},
    {stack: "color5", name: "CCTTGG", value: 15, tissue: "Lung"},

    {stack: "color1", name: "AACCGG", value: 10, tissue: "Prostate"},
    {stack: "color2", name: "AACCTT", value: 10, tissue: "Prostate"},
    {stack: "color3", name: "AATTCC", value: 5, tissue: "Prostate"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Prostate"},
    {stack: "color5", name: "CCTTGG", value: 10, tissue: "Prostate"},

    {stack: "color1", name: "AACCGG", value: 10, tissue: "Stomach"},
    {stack: "color2", name: "AACCTT", value: 10, tissue: "Stomach"},
    {stack: "color3", name: "AATTCC", value: 20, tissue: "Stomach"},
    {stack: "color4", name: "AATTGG", value: 20, tissue: "Stomach"},
    {stack: "color5", name: "CCTTGG", value: 10, tissue: "Stomach"},

    {stack: "color1", name: "AACCGG", value: 10, tissue: "Heart"},
    {stack: "color2", name: "AACCTT", value: 20, tissue: "Heart"},
    {stack: "color3", name: "AATTCC", value: 10, tissue: "Heart"},
    {stack: "color5", name: "CCTTGG", value: 10, tissue: "Heart"},


    {stack: "color1", name: "AACCGG", value: 10, tissue: "Pancreas"},
    {stack: "color2", name: "AACCTT", value: 10, tissue: "Pancreas"},
    {stack: "color3", name: "AATTCC", value: 20, tissue: "Pancreas"},
    {stack: "color4", name: "AATTGG", value: 20, tissue: "Pancreas"},
    {stack: "color5", name: "CCTTGG", value: 10, tissue: "Pancreas"},



    {stack: "color1", name: "AACCGG", value: 5, tissue: "Liver"},
    {stack: "color2", name: "AACCTT", value: 20, tissue: "Liver"},
    {stack: "color4", name: "AATTGG", value: 15, tissue: "Liver"},
    {stack: "color5", name: "CCTTGG", value: 15, tissue: "Liver"},


    {stack: "color1", name: "AACCGG", value: 10, tissue: "Trachea"},
    {stack: "color2", name: "AACCTT", value: 20, tissue: "Trachea"},
    {stack: "color3", name: "AATTCC", value: 10, tissue: "Trachea"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Trachea"},

    {stack: "color1", name: "AACCGG", value: 20, tissue: "Appendix"},
    {stack: "color2", name: "AACCTT", value: 10, tissue: "Appendix"},
    {stack: "color3", name: "AATTCC", value: 30, tissue: "Appendix"},
    {stack: "color4", name: "AATTGG", value: 10, tissue: "Appendix"},
    {stack: "color5", name: "CCTTGG", value: 20, tissue: "Appendix"},



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
    chartTooltip.uptissue(dataPoint, topicColorMap, x, y);
})
.on('customMouseOut', function() {
    chartTooltip.hide();
});
stackedBarChart.colorSchema(['#795548','#FF9801','#CDDC39','#2096F3','#673AB7','#4B74FF'])
container.datum(stackedBarData.data).call(stackedBarChart);

chartTooltip
    .topicLabel('tissue')
    .tissueLabel('key')
    .nameLabel('stack')

tooltipContainer = d3.select('.js-stacked-bar-chart-tooltip-container .metadata-group');
tooltipContainer.datum([]).call(chartTooltip);

createHorizontalStackedBarChart(); 

          
          
