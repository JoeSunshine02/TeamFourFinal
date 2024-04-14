let data, barchart, linechart,multiLineChart;
const parseTime = d3.timeParse("%Y-%m-%d");

d3.csv('data/Agrofood_co2_emission.csv').then(_data => {
    data = _data;

    data = data.filter(dataPoint =>{
        return Object.values(dataPoint).every(value => value !== 'NA');
    });
    data.forEach(d => {
        d["Savanna fires"] = parseFloat(d["Savanna fires"]);
         d["Crop Residues"] = parseFloat(d["Crop Residues"]);
        // d["Food packaging"] = parseFloat(d["Food packaging"]);
        d["Fertilizers Manufacturing"] = parseFloat(d["Fertilizers Manufacturing"]);
        d["Forest fires"] = parseFloat(d["Pesticides Manufacturing"]);
        d["Rice Cultivation"] = parseFloat(d["Rice Cultivation"]);
        d.Year = parseFloat(d.Year);
        d.rent = +d['Rural population'];
        d.insurance = +d['Urban population'];
    });

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // initialize color scale based on city name

   // console.log(data)

    barchart = new BarChart({ parentElement: ".bar-chart" }, data);
    multiLineChart = new MultiLineChart({ parentElement: '.line-chart' }, data);

    multiLineChart.updateVis(["Pesticides Manufacturing","Crop Residues","Fertilizers Manufacturing",
                            "Savanna fires","Rice Cultivation"]);

    scatterplot = new ScatterPlot({parentElement: '#scatterplot'}, data, colorScale);
    scatterplot.updateVis();
    //linechart = new LineChart({ parentElement: ".line-chart" }, data);
})


.catch(error => console.error(error));
// Todo